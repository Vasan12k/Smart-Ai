import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

export default function TableScan() {
  const { tableNumber } = useParams();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    if (order) {
      // Connect to table-specific Socket.IO namespace
      const socket = io(`/table:${tableNumber}`);
      socket.on("order_update", (updatedOrder) => {
        // Show notification when status changes
        if (order.status !== updatedOrder.status) {
          if (updatedOrder.status === "ready") {
            showNotification(
              "🍽️ Your food is ready!",
              "Your order has been prepared by the chef"
            );
          } else if (updatedOrder.status === "served") {
            showNotification(
              "✅ Order Served!",
              "Your food is being served to your table"
            );
          } else if (updatedOrder.status === "preparing") {
            showNotification("👨‍🍳 Preparing...", "Chef is preparing your order");
          }
        }
        setOrder(updatedOrder);
      });
      return () => socket.disconnect();
    }
  }, [order, tableNumber]);

  const showNotification = (title, message) => {
    setNotification({ title, message });
    // Auto-hide after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchMenu = async () => {
    try {
      // Public endpoint to get menu items
      const res = await axios.get("/manager/menu/public");
      setMenu(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  const removeFromCart = (itemId) => {
    const existing = cart.find((c) => c._id === itemId);
    if (existing.qty > 1) {
      setCart(
        cart.map((c) => (c._id === itemId ? { ...c, qty: c.qty - 1 } : c))
      );
    } else {
      setCart(cart.filter((c) => c._id !== itemId));
    }
  };

  const placeOrder = async () => {
    try {
      const items = cart.map((c) => ({
        food: c._id,
        name: c.name,
        price: c.price,
        qty: c.qty,
      }));
      const res = await axios.post("/orders/public", {
        tableNumber: parseInt(tableNumber),
        items,
        payment: { method: "cash" },
      });
      setOrder(res.data);
      setCart([]);
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl max-w-sm">
            <div className="font-bold text-lg mb-1">{notification.title}</div>
            <div className="text-sm opacity-90">{notification.message}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <h1 className="text-2xl font-bold">IPO Restaurant</h1>
        <p className="text-sm opacity-90">Table {tableNumber}</p>
      </div>

      {order ? (
        /* Order Status View */
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Your Order</h2>
            <div className="mb-4">
              <span className="text-sm text-gray-600">Order ID:</span>
              <span className="ml-2 font-mono">{order._id}</span>
            </div>
            <div className="mb-6">
              <span className="text-sm text-gray-600">Status:</span>
              <span
                className={`ml-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === "received"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "preparing"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "ready"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <h3 className="font-semibold mb-2">Items:</h3>
            <div className="space-y-2 mb-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {item.name} x {item.qty}
                  </span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>
                  ₹
                  {order.items.reduce(
                    (sum, item) => sum + item.price * item.qty,
                    0
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={() => setOrder(null)}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              Order More
            </button>
          </div>
        </div>
      ) : (
        /* Menu & Cart View */
        <>
          {/* Menu Items */}
          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Menu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menu.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    {item.category && (
                      <p className="text-sm text-gray-600">{item.category}</p>
                    )}
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-lg font-bold text-blue-600">
                        ₹{item.price}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Cart */}
          {cart.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center mb-2"
                      >
                        <span className="text-sm">
                          {item.name} x {item.qty}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-600 text-sm font-bold"
                          >
                            -
                          </button>
                          <button
                            onClick={() => addToCart(item)}
                            className="text-green-600 text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="text-xl font-bold">₹{total}</div>
                  </div>
                </div>
                <button
                  onClick={placeOrder}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-700"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
