import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // Header
      appName: "AI Powered Smart Restaurant",
      table: "Table",
      aiAssistant: "AI Assistant",

      // Menu
      menu: "Menu",
      addToCart: "Add",
      orderMore: "Order More",

      // Cart
      cart: "Cart",
      total: "Total",
      placeOrder: "Place Order",

      // Order Status
      yourOrder: "Your Order",
      orderId: "Order ID",
      status: "Status",
      items: "Items",

      // Status Types
      received: "RECEIVED",
      preparing: "PREPARING",
      ready: "READY",
      served: "SERVED",

      // AI Features
      voiceOrder: "Voice Order",
      voiceListening: "Listening...",
      voiceInstruction: "Say item names like 'chicken biryani' or 'parotta'",
      recommendedForYou: "Recommended for you",
      match: "match",

      // Notifications
      foodReady: "Your food is ready!",
      foodReadyMsg: "Your order has been prepared by the chef",
      orderServed: "Order Served!",
      orderServedMsg: "Your food is being served to your table",
      preparing: "Preparing...",
      preparingMsg: "Chef is preparing your order",
      voiceRecognized: "Voice recognized",
      youSaid: "You said",
      added: "Added",
      addedToCart: "added to cart",
      error: "Error",
      voiceError: "Could not recognize voice. Please try again.",
      notSupported: "Not supported",
      voiceNotSupported: "Voice ordering not supported in this browser",

      // Auth
      login: "Login",
      register: "Register",
      name: "Name",
      email: "Email",
      password: "Password",
      role: "Role",
      manager: "Manager",
      chef: "Chef",
      waiter: "Waiter",
      customer: "Customer",
    },
  },
  ta: {
    translation: {
      // Header
      appName: "AI ஸ்மார்ட் உணவகம்",
      table: "மேஜை",
      aiAssistant: "AI உதவியாளர்",

      // Menu
      menu: "உணவு பட்டியல்",
      addToCart: "சேர்",
      orderMore: "மேலும் ஆர்டர்",

      // Cart
      cart: "கார்ட்",
      total: "மொத்தம்",
      placeOrder: "ஆர்டர் செய்",

      // Order Status
      yourOrder: "உங்கள் ஆர்டர்",
      orderId: "ஆர்டர் எண்",
      status: "நிலை",
      items: "உணவுகள்",

      // Status Types
      received: "பெறப்பட்டது",
      preparing: "தயாரிக்கப்படுகிறது",
      ready: "தயார்",
      served: "பரிமாறப்பட்டது",

      // AI Features
      voiceOrder: "குரல் ஆர்டர்",
      voiceListening: "கேட்கிறது...",
      voiceInstruction: "'சிக்கன் பிரியாணி' அல்லது 'பரோட்டா' என்று சொல்லுங்கள்",
      recommendedForYou: "உங்களுக்காக பரிந்துரைக்கப்பட்டது",
      match: "பொருந்தும்",

      // Notifications
      foodReady: "உங்கள் உணவு தயார்!",
      foodReadyMsg: "சமையல்காரர் உங்கள் ஆர்டரை தயார் செய்துவிட்டார்",
      orderServed: "ஆர்டர் பரிமாறப்பட்டது!",
      orderServedMsg: "உங்கள் உணவு மேசைக்கு கொண்டு வரப்படுகிறது",
      preparing: "தயாரிக்கப்படுகிறது...",
      preparingMsg: "சமையல்காரர் உங்கள் ஆர்டரை தயார் செய்கிறார்",
      voiceRecognized: "குரல் அடையாளம் காணப்பட்டது",
      youSaid: "நீங்கள் சொன்னது",
      added: "சேர்க்கப்பட்டது",
      addedToCart: "கார்ட்டில் சேர்க்கப்பட்டது",
      error: "பிழை",
      voiceError: "குரலை அடையாளம் காண முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
      notSupported: "ஆதரிக்கப்படவில்லை",
      voiceNotSupported: "இந்த browser-ல் குரல் ஆர்டர் ஆதரிக்கப்படவில்லை",

      // Auth
      login: "உள்நுழை",
      register: "பதிவு செய்",
      name: "பெயர்",
      email: "மின்னஞ்சல்",
      password: "கடவுச்சொல்",
      role: "பங்கு",
      manager: "மேலாளர்",
      chef: "சமையல்காரர்",
      waiter: "வெயிட்டர்",
      customer: "வாடிக்கையாளர்",
    },
  },
  hi: {
    translation: {
      // Header
      appName: "AI स्मार्ट रेस्टोरेंट",
      table: "मेज़",
      aiAssistant: "AI सहायक",

      // Menu
      menu: "मेनू",
      addToCart: "जोड़ें",
      orderMore: "और ऑर्डर करें",

      // Cart
      cart: "कार्ट",
      total: "कुल",
      placeOrder: "ऑर्डर करें",

      // Order Status
      yourOrder: "आपका ऑर्डर",
      orderId: "ऑर्डर नंबर",
      status: "स्थिति",
      items: "वस्तुएं",

      // Status Types
      received: "प्राप्त",
      preparing: "तैयार हो रहा है",
      ready: "तैयार",
      served: "परोसा गया",

      // AI Features
      voiceOrder: "वॉइस ऑर्डर",
      voiceListening: "सुन रहा है...",
      voiceInstruction: "'चिकन बिरयानी' या 'पराठा' कहें",
      recommendedForYou: "आपके लिए सुझाया गया",
      match: "मैच",

      // Notifications
      foodReady: "आपका खाना तैयार है!",
      foodReadyMsg: "रसोइए ने आपका ऑर्डर तैयार कर दिया है",
      orderServed: "ऑर्डर परोसा गया!",
      orderServedMsg: "आपका खाना टेबल पर लाया जा रहा है",
      preparing: "तैयार हो रहा है...",
      preparingMsg: "रसोइया आपका ऑर्डर तैयार कर रहा है",
      voiceRecognized: "वॉइस पहचानी गई",
      youSaid: "आपने कहा",
      added: "जोड़ा गया",
      addedToCart: "कार्ट में जोड़ा गया",
      error: "त्रुटि",
      voiceError: "वॉइस पहचानने में असमर्थ। कृपया पुनः प्रयास करें।",
      notSupported: "समर्थित नहीं",
      voiceNotSupported: "इस ब्राउज़र में वॉइस ऑर्डरिंग समर्थित नहीं है",

      // Auth
      login: "लॉगिन",
      register: "रजिस्टर",
      name: "नाम",
      email: "ईमेल",
      password: "पासवर्ड",
      role: "भूमिका",
      manager: "मैनेजर",
      chef: "रसोइया",
      waiter: "वेटर",
      customer: "ग्राहक",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
