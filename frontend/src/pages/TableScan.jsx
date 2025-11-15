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
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
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
    console.log("🎤 Starting voice order...");

    // Check if browser supports speech recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      console.log("🎤 Speech recognition initialized");

      recognition.lang =
        i18n.language === "ta"
          ? "ta-IN"
          : i18n.language === "hi"
          ? "hi-IN"
          : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      // Add timeout for no speech
      const timeout = setTimeout(() => {
        recognition.stop();
        showNotification(
          "⏱️ Timeout",
          "No speech detected. Please try again and speak clearly."
        );
        setIsListening(false);
      }, 10000); // 10 seconds timeout

      recognition.onstart = () => {
        console.log("🎤 Recognition started");
        showNotification(
          "🎤 Listening...",
          "Speak your order now (10 seconds)"
        );
      };

      recognition.onresult = async (event) => {
        clearTimeout(timeout);
        const transcript = event.results[0][0].transcript;
        console.log("🎤 Recognized:", transcript);
        showNotification("🎤 Processing...", `You said: "${transcript}"`);

        try {
          // Send to AI backend for processing
          const response = await axios.post("/ai/voice-order", { transcript });

          if (response.data.success && response.data.items.length > 0) {
            // Add items to cart
            response.data.items.forEach((item) => {
              const menuItem = menu.find((m) => m.id === item.id);
              if (menuItem) {
                for (let i = 0; i < item.quantity; i++) {
                  addToCart(menuItem);
                }
              }
            });

            showNotification(
              "✅ Items Added!",
              `Added ${response.data.items.length} items to your cart`
            );
          } else {
            showNotification(
              "❌ No items found",
              "Please try saying the food names clearly"
            );
          }
        } catch (error) {
          console.error("Voice order error:", error);
          showNotification(
            "❌ Error",
            "Failed to process voice order. Please try again."
          );
        }

        setIsListening(false);
      };

      recognition.onerror = (event) => {
        clearTimeout(timeout);
        console.error("🎤 Speech recognition error:", event.error);
        let errorMessage = "Could not recognize voice. Please try again.";

        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          errorMessage =
            "Microphone permission denied. Please allow microphone access in browser settings and refresh page.";
        } else if (event.error === "no-speech") {
          errorMessage =
            "No speech detected. Please speak clearly into the microphone.";
        } else if (event.error === "audio-capture") {
          errorMessage =
            "No microphone found. Please check your device microphone.";
        } else if (event.error === "network") {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (event.error === "aborted") {
          errorMessage = "Speech recognition aborted. Please try again.";
        }

        showNotification("❌ Error", errorMessage);
        setIsListening(false);
      };

      recognition.onend = () => {
        clearTimeout(timeout);
        console.log("🎤 Recognition ended");
        setIsListening(false);
      };

      try {
        recognition.start();
        console.log("🎤 Starting recognition...");
      } catch (error) {
        clearTimeout(timeout);
        console.error("🎤 Failed to start:", error);
        showNotification(
          "❌ Error",
          "Failed to start voice recognition. Please use Chrome browser."
        );
        setIsListening(false);
      }
    } else {
      showNotification(
        "❌ Not supported",
        "Voice ordering not supported in this browser. Please use Chrome or Edge."
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
    const existing = cart.find((c) => c.id === item.id);
    if (existing) {
      setCart(
        cart.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const existing = cart.find((c) => c.id === itemId);
    if (existing.qty > 1) {
      setCart(
        cart.map((c) => (c.id === itemId ? { ...c, qty: c.qty - 1 } : c))
      );
    } else {
      setCart(cart.filter((c) => c.id !== itemId));
    }
  };

  const placeOrder = async () => {
    try {
      const items = cart.map((c) => ({
        food: c.id,
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

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMessage = chatMessage.trim();
    setChatMessage("");
    setIsProcessing(true);

    // Add user message to chat
    const updatedHistory = [
      ...chatHistory,
      { type: "user", text: userMessage },
    ];
    setChatHistory(updatedHistory);

    try {
      // Check if message is about ordering food
      const orderKeywords = [
        "want",
        "order",
        "get",
        "need",
        "like",
        "please",
        "i'll have",
        "give me",
      ];
      const isOrderRequest = orderKeywords.some((keyword) =>
        userMessage.toLowerCase().includes(keyword)
      );

      if (isOrderRequest) {
        // Try to parse as food order
        const orderResponse = await axios.post("/ai/voice-order", {
          transcript: userMessage,
        });

        if (orderResponse.data.success && orderResponse.data.items.length > 0) {
          // Add items to cart
          orderResponse.data.items.forEach((item) => {
            const menuItem = menu.find((m) => m.id === item.id);
            if (menuItem) {
              for (let i = 0; i < item.quantity; i++) {
                addToCart(menuItem);
              }
            }
          });

          const aiResponse = `✅ Added ${
            orderResponse.data.items.length
          } item(s) to your cart: ${orderResponse.data.items
            .map((i) => i.name)
            .join(", ")}. Anything else you'd like?`;
          setChatHistory((prev) => [...prev, { type: "ai", text: aiResponse }]);
          showNotification("✅ Items Added!", orderResponse.data.message);
          setIsProcessing(false);
          return;
        }
      }

      // General AI chat for other questions
      const chatResponse = await axios.post("/ai/chat", {
        message: userMessage,
        chatHistory: updatedHistory.slice(0, -1), // Send previous history without current message
      });

      if (chatResponse.data.success) {
        setChatHistory((prev) => [
          ...prev,
          { type: "ai", text: chatResponse.data.response },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            type: "ai",
            text: "Sorry, I couldn't process that. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory((prev) => [
        ...prev,
        {
          type: "ai",
          text: "❌ Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsProcessing(false);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-scaleIn">
          <div className="gradient-success text-white px-8 py-5 rounded-2xl shadow-2xl max-w-sm hover-lift">
            <div className="font-bold text-xl mb-2 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              {notification.title}
            </div>
            <div className="text-sm opacity-95">{notification.message}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="gradient-royal text-white p-6 sticky top-0 z-40 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="animate-fadeIn">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span className="text-4xl">🍽️</span>
              {t("appName")}
            </h1>
            <p className="text-sm opacity-90 mt-1 flex items-center gap-2">
              <span className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full font-semibold">
                {t("table")} {tableNumber}
              </span>
            </p>
          </div>
          <div className="flex gap-3 animate-slideInRight">
            {/* Language Switcher */}
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="bg-white bg-opacity-20 backdrop-blur-lg text-white px-4 py-2 rounded-xl font-semibold hover:bg-opacity-30 transition-all duration-300 cursor-pointer"
            >
              <option value="en" className="text-gray-800">
                🇬🇧 EN
              </option>
              <option value="ta" className="text-gray-800">
                🇮🇳 தமிழ்
              </option>
              <option value="hi" className="text-gray-800">
                🇮🇳 हिन्दी
              </option>
            </select>
            <button
              onClick={() => setShowAI(!showAI)}
              className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                showAI
                  ? "bg-white text-purple-600 shadow-lg"
                  : "bg-white bg-opacity-20 backdrop-blur-lg text-white hover:bg-opacity-30"
              }`}
            >
              <span className="animate-pulse-custom">🤖</span>{" "}
              {t("aiAssistant")}
            </button>
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      {showAI && !order && (
        <div className="max-w-4xl mx-auto p-6 gradient-royal rounded-2xl shadow-2xl mb-6 mt-6 animate-scaleIn glass-dark">
          <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            🤖 {t("aiAssistant")}{" "}
            <span className="text-sm font-normal opacity-75">
              Powered by AI
            </span>
          </h3>

          {/* Voice Ordering with Animation */}
          <div className="mb-6">
            <button
              onClick={startVoiceOrder}
              disabled={isListening}
              className={`w-full py-6 rounded-2xl font-bold text-white transition-all duration-300 relative overflow-hidden shadow-lg ${
                isListening
                  ? "bg-red-500 animate-pulse-custom"
                  : "gradient-sunset hover-lift hover-glow"
              }`}
            >
              {isListening && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Animated mic waves */}
                  <div className="flex gap-2">
                    <div
                      className="w-2 bg-white rounded-full animate-bounce-custom"
                      style={{ height: "30px", animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 bg-white rounded-full animate-bounce-custom"
                      style={{ height: "40px", animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 bg-white rounded-full animate-bounce-custom"
                      style={{ height: "35px", animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="w-2 bg-white rounded-full animate-bounce-custom"
                      style={{ height: "50px", animationDelay: "450ms" }}
                    ></div>
                    <div
                      className="w-2 bg-white rounded-full animate-bounce-custom"
                      style={{ height: "35px", animationDelay: "600ms" }}
                    ></div>
                    <div
                      className="w-2 bg-white rounded-full animate-bounce-custom"
                      style={{ height: "40px", animationDelay: "750ms" }}
                    ></div>
                    <div
                      className="w-2 bg-white rounded-full animate-bounce-custom"
                      style={{ height: "30px", animationDelay: "900ms" }}
                    ></div>
                  </div>
                </div>
              )}
              <span className={isListening ? "opacity-0" : "text-xl"}>
                {isListening
                  ? `🎤 ${t("voiceListening")}`
                  : `🎤 ${t("voiceOrder")}`}
              </span>
            </button>
            <p className="text-sm text-white opacity-75 mt-2 text-center">
              {isListening
                ? "🔴 Listening... Speak clearly!"
                : t("voiceInstruction")}
            </p>
          </div>

          {/* Chat Interface */}
          <div className="mb-4 bg-white rounded-2xl shadow-xl p-5 card-elevated">
            <h4 className="font-bold mb-3 text-purple-800 flex items-center gap-2 text-lg">
              💬 Chat with AI Assistant
            </h4>

            {/* Chat History */}
            <div className="h-64 overflow-y-auto mb-4 space-y-3 border-2 border-purple-100 rounded-xl p-4 bg-gradient-to-b from-gray-50 to-white">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-12 animate-fadeIn">
                  <div className="text-6xl mb-4">👋</div>
                  <p className="font-semibold text-lg">Welcome!</p>
                  <p className="text-sm">
                    Type your order below or use voice ordering
                  </p>
                </div>
              ) : (
                chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex animate-fadeIn delay-${(idx % 3) * 100} ${
                      msg.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs px-5 py-3 rounded-2xl shadow-md hover-scale ${
                        msg.type === "user"
                          ? "gradient-primary text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <p className="text-sm font-medium">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
              {isProcessing && (
                <div className="flex justify-start animate-fadeIn">
                  <div className="bg-gray-200 text-gray-800 px-5 py-3 rounded-2xl shadow-md">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce-custom"></div>
                      <div
                        className="w-3 h-3 bg-purple-600 rounded-full animate-bounce-custom"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your order... (e.g., I want biryani)"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                disabled={isProcessing}
              />
              <button
                type="submit"
                disabled={isProcessing || !chatMessage.trim()}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
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
              <span className="ml-2 font-mono">{order.id}</span>
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
          <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 animate-fadeIn">
              🍽️ Our Menu
            </h2>

            {/* Category Filter Buttons */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === "all"
                    ? "gradient-primary text-white shadow-lg transform scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover-lift"
                }`}
              >
                ✨ All
              </button>
              <button
                onClick={() => setSelectedCategory("veg")}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === "veg"
                    ? "gradient-forest text-white shadow-lg transform scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover-lift"
                }`}
              >
                🥗 Veg
              </button>
              <button
                onClick={() => setSelectedCategory("non-veg")}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === "non-veg"
                    ? "gradient-danger text-white shadow-lg transform scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover-lift"
                }`}
              >
                🍗 Non-Veg
              </button>
              <button
                onClick={() => setSelectedCategory("appetizer")}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === "appetizer"
                    ? "gradient-warning text-white shadow-lg transform scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover-lift"
                }`}
              >
                🥟 Appetizer
              </button>
              <button
                onClick={() => setSelectedCategory("dessert")}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === "dessert"
                    ? "gradient-success text-white shadow-lg transform scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover-lift"
                }`}
              >
                🍰 Dessert
              </button>
              <button
                onClick={() => setSelectedCategory("drinks")}
                className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === "drinks"
                    ? "gradient-info text-white shadow-lg transform scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover-lift"
                }`}
              >
                🥤 Drinks
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {menu
                .filter(
                  (item) =>
                    selectedCategory === "all" ||
                    item.category === selectedCategory
                )
                .map((item, index) => (
                  <div
                    key={item.id}
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
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                          ₹{item.price}
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-bold text-xl text-gray-800 mb-2">
                        {item.name}
                      </h3>
                      {item.category && (
                        <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                          {item.category}
                        </span>
                      )}
                      <div className="flex justify-between items-center mt-4">
                        {!item.imageUrl && (
                          <span className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
                            ₹{item.price}
                          </span>
                        )}
                        <button
                          onClick={() => addToCart(item)}
                          className={`gradient-success text-white px-6 py-3 rounded-xl font-bold hover-lift hover-glow transition-all duration-300 ${
                            !item.imageUrl ? "ml-auto" : "w-full"
                          }`}
                        >
                          ➕ Add to Cart
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
                        key={item.id}
                        className="flex justify-between items-center mb-2"
                      >
                        <span className="text-sm">
                          {item.name} x {item.qty}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
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
