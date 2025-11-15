import React, { useState, useEffect } from "react";
import axios from "../config/axios";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";

export default function Chef() {
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
    const socket = io("http://localhost:4000/chef");
    socket.on("new_order", (order) => {
      setOrders((prev) => [order, ...prev]);
    });
    socket.on("order_status_changed", (order) => {
      setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)));
    });
    return () => socket.disconnect();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get("/orders");
      setOrders(
        res.data.filter(
          (o) => o.status !== "served" && o.status !== "completed"
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.patch(`/orders/${orderId}/status`, { status });
      loadOrders();
    } catch (e) {
      console.error("Status update error:", e);
      alert("Failed to update order status. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="gradient-forest text-white p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 animate-fadeIn">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-lg animate-pulse-custom">
              <svg
                className="w-10 h-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold">👨‍🍳 Chef Panel</h1>
              <p className="text-sm opacity-90 mt-1">Kitchen Dashboard</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-white bg-opacity-20 backdrop-blur-lg hover:bg-opacity-30 px-6 py-3 rounded-xl font-bold transition-all duration-300 hover-lift animate-slideInRight"
          >
            🚪 Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-4xl">🔥</span>
            Incoming Orders
          </h2>
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg font-bold">
            {orders.length} Active Orders
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className={`card-elevated p-6 hover-scale animate-fadeIn delay-${
                (index % 4) * 100
              } ${
                order.status === "preparing"
                  ? "border-l-4 border-yellow-500"
                  : order.status === "received"
                  ? "border-l-4 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-2xl text-gray-800 flex items-center gap-2">
                    🪑 Table {order.tableNumber}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                        order.status === "received"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "preparing"
                          ? "bg-yellow-100 text-yellow-800 animate-pulse-custom"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {order.status === "received"
                        ? "📥 New Order"
                        : order.status === "preparing"
                        ? "👨‍🍳 Cooking..."
                        : "✅ Ready"}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    ⏰ {new Date(order.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>📝</span> Order Items:
                </h4>
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-800"
                    >
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                        {item.qty}x
                      </span>
                      <span className="font-semibold">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-3">
                {order.status === "received" && (
                  <button
                    onClick={() => updateStatus(order.id, "preparing")}
                    className="flex-1 gradient-warning text-white px-6 py-4 rounded-xl font-bold hover-lift hover-glow transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    🔥 Start Cooking
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => updateStatus(order.id, "ready")}
                    className="flex-1 gradient-success text-white px-6 py-4 rounded-xl font-bold hover-lift hover-glow transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    ✅ Mark Ready
                  </button>
                )}
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="col-span-2 text-center py-20 animate-fadeIn">
              <div className="text-8xl mb-4">😴</div>
              <p className="text-2xl font-bold text-gray-400">
                No Pending Orders
              </p>
              <p className="text-gray-500 mt-2">Kitchen is all caught up!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
