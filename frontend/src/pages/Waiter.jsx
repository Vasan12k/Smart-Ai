import React, { useState, useEffect } from "react";
import axios from "../config/axios";
import io from "socket.io-client";
import { useAuth } from "../context/AuthContext";

export default function Waiter() {
  const { logout } = useAuth();
  const [readyOrders, setReadyOrders] = useState([]);

  useEffect(() => {
    loadOrders();
    const socket = io("http://localhost:4000/waiter");
    socket.on("order_status_changed", (order) => {
      if (order.status === "ready") {
        setReadyOrders((prev) => [order, ...prev]);
      } else {
        setReadyOrders((prev) => prev.filter((o) => o.id !== order.id));
      }
    });
    return () => socket.disconnect();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await axios.get("/orders");
      setReadyOrders(res.data.filter((o) => o.status === "ready"));
    } catch (e) {
      console.error(e);
    }
  };

  const markServed = async (orderId) => {
    try {
      await axios.patch(`/orders/${orderId}/status`, { status: "served" });
      loadOrders();
    } catch (e) {
      console.error("Mark served error:", e);
      alert("Failed to mark order as served. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <header className="gradient-royal text-white p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 animate-fadeIn">
            <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-lg animate-pulse-custom">
              <svg
                className="w-10 h-10"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold">🤵 Waiter Panel</h1>
              <p className="text-sm opacity-90 mt-1">Service Dashboard</p>
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
            <span className="text-4xl">🍽️</span>
            Ready to Serve
          </h2>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg font-bold animate-pulse-custom">
            {readyOrders.length} Orders Ready
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {readyOrders.map((order, index) => (
            <div
              key={order.id}
              className={`card-elevated p-6 hover-scale animate-fadeIn delay-${
                (index % 4) * 100
              } border-l-4 border-green-500`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-2xl text-gray-800 flex items-center gap-2">
                    🪑 Table {order.tableNumber}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold animate-glow">
                      ✅ Ready to Serve
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-xl font-semibold text-sm">
                    💳 {order.payment.method}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
                <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <span>📋</span> Order Details:
                </h4>
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-800"
                    >
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                        {item.qty}x
                      </span>
                      <span className="font-semibold">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => markServed(order.id)}
                className="w-full gradient-info text-white px-6 py-4 rounded-xl font-bold hover-lift hover-glow transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span className="text-xl">✓</span>
                Mark as Served
              </button>
            </div>
          ))}

          {readyOrders.length === 0 && (
            <div className="col-span-2 text-center py-20 animate-fadeIn">
              <div className="text-8xl mb-4">☕</div>
              <p className="text-2xl font-bold text-gray-400">
                No Orders Ready
              </p>
              <p className="text-gray-500 mt-2">Waiting for kitchen...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
