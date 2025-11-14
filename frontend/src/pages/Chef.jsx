import React, { useState, useEffect } from "react";
import axios from "axios";
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
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
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
      alert("Failed to update");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chef Panel</h1>
        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </header>

      <main className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Incoming Orders</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-lg">
                    Table {order.tableNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: <span className="font-medium">{order.status}</span>
                  </p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </div>
              </div>
              <ul className="mb-3">
                {order.items.map((item, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium">{item.qty}x</span> {item.name}
                  </li>
                ))}
              </ul>
              <div className="flex space-x-2">
                {order.status === "received" && (
                  <button
                    onClick={() => updateStatus(order._id, "preparing")}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => updateStatus(order._id, "ready")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Mark Ready
                  </button>
                )}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-gray-500 text-center">No pending orders</p>
          )}
        </div>
      </main>
    </div>
  );
}
