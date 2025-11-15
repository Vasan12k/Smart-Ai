const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const { getDb } = require("../config/firebase");
const fetch = require("node-fetch");

// AI Recommendations endpoint with Groq API
router.post("/recommendations", async (req, res) => {
  try {
    const { preferences, orderHistory } = req.body;

    let menuItems = [];

    // Try to get menu items from Firebase (optional)
    try {
      const db = getDb();
      const foodItemsRef = db.collection("foodItems");
      const snapshot = await foodItemsRef.get();

      snapshot.forEach((doc) => {
        menuItems.push(doc.data().name);
      });
    } catch (dbError) {
      console.log("Could not fetch menu items from Firebase:", dbError.message);
      // Continue with empty menu
    }

    // Use Groq API for AI recommendations
    if (process.env.OPENAI_API_KEY && menuItems.length > 0) {
      try {
        const response = await fetch(
          `${process.env.OPENAI_BASE_URL}/chat/completions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: `You are a helpful restaurant assistant. Recommend 3 dishes from this menu: ${menuItems.join(
                    ", "
                  )}. Return ONLY a JSON array with format: [{"name": "dish name", "reason": "why recommend", "confidence": 0.85}]`,
                },
                {
                  role: "user",
                  content: "What should I order?",
                },
              ],
              temperature: 0.7,
              max_tokens: 500,
            }),
          }
        );

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Parse AI response
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const recommendations = JSON.parse(jsonMatch[0]);
          return res.json({ recommendations });
        }
      } catch (aiError) {
        console.error("AI API Error:", aiError);
      }
    }

    // Fallback recommendations
    const recommendations = menuItems.slice(0, 3).map((name, idx) => ({
      name,
      reason: idx === 0 ? "Popular choice" : "Highly rated",
      confidence: 0.8 - idx * 0.1,
    }));

    res.json({ recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Voice to order processing with Groq API
router.post("/voice-order", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ message: "Transcript required" });
    }

    let menuItems = [];

    // Try to get menu items from Firebase (optional)
    try {
      const db = getDb();
      const foodItemsRef = db.collection("foodItems");
      const snapshot = await foodItemsRef.get();

      snapshot.forEach((doc) => {
        menuItems.push({ id: doc.id, ...doc.data() });
      });
    } catch (dbError) {
      console.log("Could not fetch menu items from Firebase:", dbError.message);
      // Continue with empty menu - will use fallback
    }

    // Use Groq API to parse voice order
    if (process.env.OPENAI_API_KEY && menuItems.length > 0) {
      try {
        const menuList = menuItems.map((item) => item.name).join(", ");

        const response = await fetch(
          `${process.env.OPENAI_BASE_URL}/chat/completions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: [
                {
                  role: "system",
                  content: `You are a restaurant order parser. Available menu items: ${menuList}. Parse the user's order and return ONLY a JSON array of items they want to order. Format: [{"name": "exact menu item name", "quantity": number}]. If item not in menu, skip it.`,
                },
                {
                  role: "user",
                  content: transcript,
                },
              ],
              temperature: 0.3,
              max_tokens: 300,
            }),
          }
        );

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Parse AI response
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsedItems = JSON.parse(jsonMatch[0]);

          // Match with actual menu items
          const orderItems = parsedItems
            .map((parsed) => {
              const menuItem = menuItems.find(
                (m) => m.name.toLowerCase() === parsed.name.toLowerCase()
              );
              return menuItem
                ? {
                    id: menuItem.id,
                    name: menuItem.name,
                    price: menuItem.price,
                    quantity: parsed.quantity || 1,
                  }
                : null;
            })
            .filter(Boolean);

          return res.json({
            success: true,
            transcript,
            items: orderItems,
            message: `Found ${orderItems.length} items from your order`,
          });
        }
      } catch (aiError) {
        console.error("AI API Error:", aiError);
      }
    }

    // Fallback: simple text matching
    const lowerTranscript = transcript.toLowerCase();
    const foundItems = menuItems
      .filter((item) => lowerTranscript.includes(item.name.toLowerCase()))
      .map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      }));

    res.json({
      success: true,
      transcript,
      items: foundItems,
      message:
        foundItems.length > 0
          ? `Found ${foundItems.length} items`
          : "No items found. Please try again.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// General AI chat endpoint - answers any question using Groq
router.post("/chat", async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    // Use Groq API for general chat
    if (process.env.OPENAI_API_KEY) {
      try {
        let menuContext = "";

        // Try to get menu items from Firebase (optional)
        try {
          const db = getDb();
          const foodItemsRef = db.collection("foodItems");
          const snapshot = await foodItemsRef.get();

          const menuItems = [];
          snapshot.forEach((doc) => {
            menuItems.push(doc.data().name);
          });

          if (menuItems.length > 0) {
            menuContext = `\n\nOur menu includes: ${menuItems.join(", ")}.`;
          }
        } catch (dbError) {
          console.log(
            "Could not fetch menu items from Firebase:",
            dbError.message
          );
          // Continue without menu context
        }

        // Build conversation history
        const messages = [
          {
            role: "system",
            content: `You are a friendly and helpful AI restaurant assistant. You can help customers with:
- Menu recommendations and information
- Food ordering assistance
- Answering questions about dishes
- General conversation and help
${menuContext}

Be conversational, friendly, and helpful. If they ask about ordering food, mention the items from the menu.`,
          },
        ];

        // Add chat history if provided
        if (chatHistory && Array.isArray(chatHistory)) {
          chatHistory.forEach((msg) => {
            messages.push({
              role: msg.type === "user" ? "user" : "assistant",
              content: msg.text,
            });
          });
        }

        // Add current user message
        messages.push({
          role: "user",
          content: message,
        });

        console.log(
          "Sending request to:",
          `${process.env.OPENAI_BASE_URL}/chat/completions`
        );
        console.log("With model:", "llama-3.3-70b-versatile");

        const response = await fetch(
          `${process.env.OPENAI_BASE_URL}/chat/completions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: messages,
              temperature: 0.7,
              max_tokens: 500,
            }),
          }
        );

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Groq API Error Response:", errorText);
          throw new Error(`Groq API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Groq API Response data:", JSON.stringify(data, null, 2));
        const aiResponse = data.choices[0].message.content;

        return res.json({
          success: true,
          response: aiResponse,
        });
      } catch (aiError) {
        console.error("AI Chat Error Details:");
        console.error("  Message:", aiError.message);
        console.error("  Stack:", aiError.stack);
        return res.status(500).json({
          success: false,
          message: "AI service error. Please try again.",
          error: aiError.message,
        });
      }
    }

    // Fallback response if no API key
    res.json({
      success: true,
      response:
        "Hello! I'm here to help you with your order. Please let me know what you'd like to eat!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
