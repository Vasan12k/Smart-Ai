import React, { useState, useEffect } from "react";
import axios from "axios";
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
        setReadyOrders((prev) => prev.filter((o) => o._id !== order._id));
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
      alert("Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Waiter Panel</h1>
        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Ready to Serve</h2>
        <div className="space-y-4">
          {readyOrders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-lg">
                    Table {order.tableNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Payment: {order.payment.method}
                  </p>
                </div>
              </div>
              <ul className="mb-3">
                {order.items.map((item, idx) => (
                  <li key={idx} className="text-sm">
                    {item.qty}x {item.name}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => markServed(order._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Mark as Served
              </button>
            </div>
          ))}
          {readyOrders.length === 0 && (
            <p className="text-gray-500 text-center">No orders ready</p>
          )}
        </div>
      </main>
    </div>
  );
}
