import React, { useState, useEffect } from "react";
import axios from "axios";
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-orange-600 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Customer</h1>
          <p className="text-sm">Table {tableNumber}</p>
        </div>
        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </header>

      <nav className="bg-white shadow">
        <div className="flex space-x-4 p-2">
          {["menu", "cart", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab ? "bg-orange-500 text-white" : "bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "cart" && cart.length > 0 && ` (${cart.length})`}
            </button>
          ))}
        </div>
      </nav>

      <main className="p-4 max-w-4xl mx-auto">
        {activeTab === "menu" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Menu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menu.map((item) => (
                <div key={item._id} className="bg-white p-4 rounded shadow">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-40 object-cover rounded mb-2"
                    />
                  )}
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                  <p className="text-lg font-bold mb-2">₹{item.price}</p>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "cart" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center">Cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white p-4 rounded shadow flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          ₹{item.price} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateCartQty(item._id, item.qty - 1)}
                          className="bg-gray-200 px-3 py-1 rounded"
                        >
                          -
                        </button>
                        <span className="font-semibold">{item.qty}</span>
                        <button
                          onClick={() => updateCartQty(item._id, item.qty + 1)}
                          className="bg-gray-200 px-3 py-1 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-4 rounded shadow mb-4">
                  <p className="text-lg font-bold">Total: ₹{cartTotal}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => placeOrder("cash")}
                    className="flex-1 bg-green-600 text-white py-3 rounded hover:bg-green-700 font-semibold"
                  >
                    Pay Cash
                  </button>
                  <button
                    onClick={() => placeOrder("online")}
                    className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-semibold"
                  >
                    Pay Online
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Orders</h2>
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">
                        Order #{order._id.slice(-6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Status:{" "}
                        <span
                          className={`font-medium ${
                            order.status === "served"
                              ? "text-green-600"
                              : order.status === "ready"
                              ? "text-blue-600"
                              : order.status === "preparing"
                              ? "text-yellow-600"
                              : "text-gray-600"
                          }`}
                        >
                          {order.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <ul className="mb-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm">
                        {item.qty}x {item.name} - ₹{item.price * item.qty}
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm">
                      Payment: {order.payment.method}
                    </span>
                    <span className="font-bold">
                      Total: ₹
                      {order.items.reduce((sum, i) => sum + i.price * i.qty, 0)}
                    </span>
                  </div>
                </div>
              ))}
              {myOrders.length === 0 && (
                <p className="text-gray-500 text-center">No orders yet</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
