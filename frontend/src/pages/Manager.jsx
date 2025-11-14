import React, { useState, useEffect } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Manager() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("menu");
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: "",
  });
  const [qrTable, setQrTable] = useState("");

  useEffect(() => {
    loadMenu();
    loadOrders();
  }, []);

  const loadMenu = async () => {
    try {
      const res = await axios.get("/manager/menu");
      setMenuItems(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await axios.get("/orders");
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const addMenuItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/manager/menu", {
        ...newItem,
        price: parseFloat(newItem.price),
      });
      console.log("Item added successfully:", response.data);
      setNewItem({ name: "", price: "", category: "", imageUrl: "" });
      loadMenu();
      alert("Item added successfully!");
    } catch (e) {
      console.error("Failed to add item:", e);
      const errorMsg =
        e.response?.data?.message || e.message || "Failed to add item";
      alert(`Failed to add item: ${errorMsg}`);
    }
  };

  const generateQR = () => {
    if (!qrTable) return;
    // QR code will encode the URL to table scan page with table number
    const url = `${window.location.origin}/table/${qrTable}`;
    return <QRCodeSVG value={url} size={256} level="H" />;
  };

  const analyticsData = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toLocaleDateString();
    const existing = acc.find((d) => d.date === date);
    const total = order.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    if (existing) {
      existing.revenue += total;
    } else {
      acc.push({ date, revenue: total });
    }
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manager Panel</h1>
        <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
          Logout
        </button>
      </header>

      <nav className="bg-white shadow">
        <div className="flex space-x-4 p-2">
          {["menu", "orders", "qr", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      <main className="p-4 max-w-6xl mx-auto">
        {activeTab === "menu" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Menu Management</h2>
            <form
              onSubmit={addMenuItem}
              className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                placeholder="Name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="border px-3 py-2 rounded"
                required
              />
              <input
                placeholder="Price"
                type="number"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                className="border px-3 py-2 rounded"
                required
              />
              <input
                placeholder="Category"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />
              <input
                placeholder="Image URL"
                value={newItem.imageUrl}
                onChange={(e) =>
                  setNewItem({ ...newItem, imageUrl: e.target.value })
                }
                className="border px-3 py-2 rounded"
              />
              <button
                type="submit"
                className="md:col-span-2 bg-blue-600 text-white py-2 rounded"
              >
                Add Item
              </button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
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
                  <p className="text-lg font-bold">₹{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">All Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">Table {order.tableNumber}</p>
                      <p className="text-sm text-gray-600">
                        Status: {order.status}
                      </p>
                      <p className="text-sm">
                        Payment: {order.payment.method}{" "}
                        {order.payment.paid ? "(Paid)" : "(Pending)"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-2">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="text-sm">
                        {item.qty}x {item.name} - ₹{item.price * item.qty}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "qr" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Generate QR Codes for Tables
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tableNum) => (
                <div
                  key={tableNum}
                  className="bg-white p-6 rounded-lg shadow-lg text-center"
                >
                  <h3 className="text-xl font-bold mb-3">Table {tableNum}</h3>
                  <div className="flex justify-center mb-4">
                    <QRCodeSVG
                      value={
                        window.location.hostname === "localhost"
                          ? `http://10.205.196.96:3000/table/${tableNum}`
                          : `${window.location.origin}/table/${tableNum}`
                      }
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Scan to Order</p>
                  <a
                    href={`/table/${tableNum}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Open Table {tableNum} →
                  </a>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Instructions:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Print these QR codes and place them on each table</li>
                <li>• Customers scan the QR code to open the menu</li>
                <li>• Orders appear automatically in Chef and Waiter panels</li>
                <li>• No login required for customers!</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
            <div className="bg-white p-6 rounded shadow">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
