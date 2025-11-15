import React, { useState, useEffect } from "react";
import axios from "../config/axios";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { useSearchParams } from "react-router-dom";

export default function Customer() {
  const { logout, user } = useAuth();
  const [searchParams] = useSearchParams();
  const tableNumber = parseInt(searchParams.get("table")) || 1;

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("menu");

  useEffect(() => {
    loadMenu();
    loadMyOrders();

    const socket = io(`http://localhost:4000/table:${tableNumber}`);
    socket.on("order_update", (order) => {
      setMyOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
    });
    return () => socket.disconnect();
  }, [tableNumber]);

  const loadMenu = async () => {
    try {
      // In a real app, you'd have a public menu endpoint or use manager endpoint
      // For now, we'll fetch from manager endpoint (in production, make a public one)
      const res = await axios.get("/manager/menu");
      setMenu(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadMyOrders = async () => {
    try {
      const res = await axios.get("/orders");
      setMyOrders(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find((c) => c._id === item._id);
    if (existing) {
      setCart(
        cart.map((c) => (c._id === item._id ? { ...c, qty: c.qty + 1 } : c))
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateCartQty = (itemId, qty) => {
    if (qty <= 0) {
      setCart(cart.filter((c) => c._id !== itemId));
    } else {
      setCart(cart.map((c) => (c._id === itemId ? { ...c, qty } : c)));
    }
  };

  const placeOrder = async (paymentMethod) => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    try {
      const items = cart.map((c) => ({
        name: c.name,
        price: c.price,
        qty: c.qty,
      }));
      await axios.post("/orders", {
        tableNumber,
        items,
        payment: { method: paymentMethod },
      });
      setCart([]);
      loadMyOrders();
      setActiveTab("orders");
    } catch (e) {
      alert("Failed to place order");
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 pb-20">
      <header className="gradient-sunset text-white p-3 sm:p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div className="animate-fadeIn">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold flex items-center gap-1 sm:gap-2">
              <span className="text-2xl sm:text-3xl md:text-4xl">👤</span>
              <span className="hidden sm:inline">Customer Portal</span>
              <span className="sm:hidden">Portal</span>
            </h1>
            <p className="text-xs sm:text-sm opacity-90 mt-1 bg-white bg-opacity-20 backdrop-blur-sm px-2 sm:px-4 py-1 rounded-full inline-block">
              🪑 Table {tableNumber}
            </p>
          </div>
          <button
            onClick={logout}
            className="bg-white bg-opacity-20 backdrop-blur-lg hover:bg-opacity-30 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition-all duration-300 hover-lift animate-slideInRight"
          >
            <span className="sm:hidden">🚺</span>
            <span className="hidden sm:inline">🚺 Logout</span>
          </button>
        </div>
      </header>

      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex space-x-2 p-2 sm:p-4 overflow-x-auto">
          {[
            { key: "menu", icon: "🍽️", label: "Menu" },
            { key: "cart", icon: "🛒", label: "Cart", badge: cart.length },
            { key: "orders", icon: "📋", label: "Orders" },
          ].map((tab, index) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold transition-all duration-300 relative animate-fadeIn delay-${
                index * 100
              } whitespace-nowrap ${
                activeTab === tab.key
                  ? "gradient-sunset text-white shadow-lg transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover-lift"
              }`}
            >
              <span className="mr-1 sm:mr-2">{tab.icon}</span>
              {tab.label}
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center animate-pulse-custom">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="p-3 sm:p-6 max-w-7xl mx-auto">
        {activeTab === "menu" && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
              <span className="text-3xl sm:text-4xl">🍽️</span>
              Our Menu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {menu.map((item, index) => (
                <div
                  key={item._id}
                  className={`card-elevated overflow-hidden hover-scale animate-fadeIn delay-${
                    (index % 3) * 100
                  }`}
                >
                  {item.imageUrl && (
                    <div className="relative overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                        ₹{item.price}
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <span className="inline-block bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                      {item.category}
                    </span>
                    {!item.imageUrl && (
                      <p className="text-2xl font-bold gradient-sunset bg-clip-text text-transparent mb-3">
                        ₹{item.price}
                      </p>
                    )}
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full gradient-success text-white py-3 rounded-xl font-bold hover-lift hover-glow transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      ➕ Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "cart" && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
              <span className="text-3xl sm:text-4xl">🛒</span>
              Your Cart
            </h2>
            {cart.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <div className="text-6xl sm:text-8xl mb-4">🛍️</div>
                <p className="text-xl sm:text-2xl font-bold text-gray-400">
                  Cart is Empty
                </p>
                <p className="text-gray-500 mt-2">Add some delicious items!</p>
                <button
                  onClick={() => setActiveTab("menu")}
                  className="mt-6 gradient-sunset text-white px-8 py-4 rounded-xl font-bold hover-lift transition-all duration-300"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item, index) => (
                    <div
                      key={item._id}
                      className={`card-elevated p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center hover-scale animate-fadeIn delay-${
                        index * 100
                      }`}
                    >
                      <div className="flex-1 mb-3 sm:mb-0">
                        <h3 className="font-bold text-lg sm:text-xl text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          ₹{item.price} each
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-start space-x-3 sm:space-x-4">
                        <button
                          onClick={() => updateCartQty(item._id, item.qty - 1)}
                          className="bg-gradient-to-r from-red-500 to-pink-500 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-bold hover-lift transition-all duration-300 flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="font-bold text-xl sm:text-2xl text-gray-800 min-w-[2.5rem] sm:min-w-[3rem] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateCartQty(item._id, item.qty + 1)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl font-bold hover-lift transition-all duration-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="card-elevated p-4 sm:p-6 mb-4 sm:mb-6 bg-gradient-to-r from-orange-50 to-red-50">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
                    <span className="text-lg sm:text-2xl font-bold text-gray-800">
                      Total Amount:
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold gradient-sunset bg-clip-text text-transparent">
                      ₹{cartTotal}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <button
                    onClick={() => placeOrder("cash")}
                    className="gradient-forest text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover-lift hover-glow transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span className="text-xl sm:text-2xl">💵</span>
                    Pay with Cash
                  </button>
                  <button
                    onClick={() => placeOrder("online")}
                    className="gradient-info text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover-lift hover-glow transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span className="text-xl sm:text-2xl">💳</span>
                    Pay Online
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
              <span className="text-3xl sm:text-4xl">📋</span>
              My Orders
            </h2>
            <div className="space-y-4">
              {myOrders.map((order, index) => (
                <div
                  key={order._id}
                  className={`card-elevated p-4 sm:p-6 hover-scale animate-fadeIn delay-${
                    (index % 3) * 100
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
                    <div>
                      <p className="font-bold text-lg sm:text-xl text-gray-800 flex items-center gap-2">
                        <span>🧾</span>
                        Order #{order._id.slice(-6)}
                      </p>
                      <div className="mt-2">
                        <span
                          className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${
                            order.status === "served"
                              ? "bg-green-100 text-green-800"
                              : order.status === "ready"
                              ? "bg-blue-100 text-blue-800 animate-pulse-custom"
                              : order.status === "preparing"
                              ? "bg-yellow-100 text-yellow-800 animate-pulse-custom"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status === "served"
                            ? "✅ Served"
                            : order.status === "ready"
                            ? "🍽️ Ready"
                            : order.status === "preparing"
                            ? "👨‍🍳 Preparing"
                            : "📥 Received"}
                        </span>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto sm:text-right">
                      <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full inline-block">
                        ⏰ {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 sm:p-4 mb-4">
                    <h4 className="font-bold text-sm sm:text-base text-gray-700 mb-3 flex items-center gap-2">
                      <span>📝</span> Order Items:
                    </h4>
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-gray-800 gap-2 sm:gap-0"
                        >
                          <span className="flex items-center gap-2">
                            <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                              {item.qty}x
                            </span>
                            <span className="font-semibold text-sm sm:text-base">
                              {item.name}
                            </span>
                          </span>
                          <span className="font-bold text-gray-700 text-sm sm:text-base ml-8 sm:ml-0">
                            ₹{item.price * item.qty}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 pt-3 sm:pt-4 border-t-2 border-gray-200">
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 flex items-center gap-2">
                      <span>💳</span>
                      Payment: {order.payment.method}
                    </span>
                    <span className="text-lg sm:text-2xl font-bold gradient-sunset bg-clip-text text-transparent">
                      Total: ₹
                      {order.items.reduce((sum, i) => sum + i.price * i.qty, 0)}
                    </span>
                  </div>
                </div>
              ))}
              {myOrders.length === 0 && (
                <div className="text-center py-12 sm:py-20">
                  <div className="text-6xl sm:text-8xl mb-4">📋</div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-400">
                    No Orders Yet
                  </p>
                  <p className="text-gray-500 mt-2">
                    Start by browsing our menu!
                  </p>
                  <button
                    onClick={() => setActiveTab("menu")}
                    className="mt-6 gradient-sunset text-white px-8 py-4 rounded-xl font-bold hover-lift transition-all duration-300"
                  >
                    Browse Menu
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
