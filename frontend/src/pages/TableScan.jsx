import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { useTranslation } from "react-i18next";

export default function TableScan() {
  const { tableNumber } = useParams();
  const { t, i18n } = useTranslation();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showAI, setShowAI] = useState(false);
  const [isListening, setIsListening] = useState(false);
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
      // Fetch AI recommendations
      fetchRecommendations();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const res = await axios.post("/ai/recommendations", {
        preferences: [],
        orderHistory: [],
      });
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    }
  };

  const startVoiceOrder = () => {
    setIsListening(true);
    // Check if browser supports speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        showNotification("🎤 Voice recognized", `You said: "${transcript}"`);
        // Parse voice command to add items
        parseVoiceCommand(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        showNotification(
          "❌ Error",
          "Could not recognize voice. Please try again."
        );
        setIsListening(false);
      };

      recognition.start();
    } else {
      showNotification(
        "❌ Not supported",
        "Voice ordering not supported in this browser"
      );
      setIsListening(false);
    }
  };

  const parseVoiceCommand = (text) => {
    const lowerText = text.toLowerCase();
    menu.forEach((item) => {
      if (lowerText.includes(item.name.toLowerCase())) {
        addToCart(item);
        showNotification("✅ Added", `${item.name} added to cart`);
      }
    });
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{t("appName")}</h1>
            <p className="text-sm opacity-90">
              {t("table")} {tableNumber}
            </p>
          </div>
          <div className="flex gap-2">
            {/* Language Switcher */}
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="bg-white text-purple-600 px-3 py-1 rounded text-sm font-semibold"
            >
              <option value="en">🇬🇧 EN</option>
              <option value="ta">🇮🇳 தமிழ்</option>
              <option value="hi">🇮🇳 हिन्दी</option>
            </select>
            <button
              onClick={() => setShowAI(!showAI)}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-50 transition"
            >
              🤖 {t("aiAssistant")}
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      {showAI && !order && (
        <div className="max-w-4xl mx-auto p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg mb-4 mt-4">
          <h3 className="text-lg font-bold mb-3 text-purple-800">
            🤖 {t("aiAssistant")}
          </h3>

          {/* Voice Ordering */}
          <div className="mb-4">
            <button
              onClick={startVoiceOrder}
              disabled={isListening}
              className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                isListening
                  ? "bg-red-500 animate-pulse"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              }`}
            >
              {isListening
                ? `🎤 ${t("voiceListening")}`
                : `🎤 ${t("voiceOrder")}`}
            </button>
            <p className="text-xs text-gray-600 mt-1 text-center">
              {t("voiceInstruction")}
            </p>
          </div>

          {/* AI Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-purple-800">
                ✨ Recommended for you:
              </h4>
              <div className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-3 rounded-lg shadow flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{rec.name}</p>
                      <p className="text-xs text-gray-600">{rec.reason}</p>
                      <div className="flex items-center mt-1">
                        <div className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                          {Math.round(rec.confidence * 100)}% {t("match")}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const item = menu.find((m) =>
                          m.name.toLowerCase().includes(rec.name.toLowerCase())
                        );
                        if (item) {
                          addToCart(item);
                          showNotification(
                            "✅ Added",
                            `${item.name} added to cart`
                          );
                        }
                      }}
                      className="ml-3 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

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
