"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Send, ShieldCheck, AlertTriangle, Clock, CheckCircle2,
  XCircle, User, Users, ArrowUpRight, ArrowDownLeft, RefreshCw,
  Phone, KeyRound, ChevronRight, Settings, Info, Sparkles, Volume2,
  FileText, ShieldAlert, History, Plus, Check, Play, Square, ExternalLink,
  QrCode, Landmark, Smartphone, HeartHandshake, Eye, EyeOff, HelpCircle,
  ZoomIn, ZoomOut, Contrast, Globe, Shield, MessageCircle, AlertCircle, Edit3, X,
  PhoneCall, PhoneForwarded, Radio, MessageSquare, FastForward, Rewind, PlayCircle
} from 'lucide-react';

interface TransferAlert {
  id: string;
  senderName: string;
  senderPhone: string;
  recipientName: string;
  upiId: string;
  amount: number;
  baselineAmount: number;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskReason: string;
  timestamp: string;
  advisoryStatus: 'PENDING' | 'LOOKS_EXPECTED' | 'DONT_RECOGNIZE' | 'REQUEST_VERIFY';
  guardianNote?: string;
  finalStatus: 'PENDING_ADVISORY' | 'AWAITING_USER_CONFIRMATION' | 'AUTHORIZED_PAID' | 'CANCELLED';
  verifiedOverPhone?: boolean;
}

interface Person {
  name: string;
  upiId: string;
  avatar: string;
  color: string;
  lastPaid: string;
  baseline: number;
}

interface CallTurn {
  id: string;
  event_type: string;
  actor: string;
  action: string;
  decision: string;
  notes: string;
  timestamp?: string;
  details?: any;
}

// ─────────────────────────────────────────────────────────────────────────────
// 🌐 MULTILINGUAL TRANSLATION ENGINE (EN, HI, KN, MR, TA)
// ─────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    appTitle: "BankSathi",
    familyShield: "FAMILY SHIELD",
    tagline: "Shared Guidance, Not Shared Access",
    userTag: "USER",
    guardianTag: "GUARDIAN",
    runStory: "▶️ 5-Step Guided Story Tour",
    editNames: "Customize Names",
    fontSize: "Font Size:",
    contrastOn: "High Contrast ON",
    contrastOff: "Standard Contrast",
    shieldActive: "Family Shield Active",
    guardianLabel: "Guardian:",
    savingsBalance: "Savings Balance",
    readBalance: "🔊 Read Balance Out Loud",
    speakPlaceholder: "Speak or type: 'Send 5000 to {recipient}'...",
    scanQr: "Scan QR",
    payContacts: "Pay Contacts",
    bankTransfer: "Bank Transfer",
    trustedCircle: "Trusted Circle",
    pendingReview: "Pending Transfer Review",
    paying: "Paying",
    riskAnomaly: "Risk Anomaly",
    protectionCheck: "Behavioral Protection Check:",
    trustedAdvisory: "Trusted Circle Advisory",
    viewAs: "View as",
    awaitingOpinion: "Advisory ping sent to {guardian}. Awaiting second opinion...",
    looksExpectedTitle: "✓ {guardian}: \"Looks Expected\"",
    dontRecognizeTitle: "⚠️ {guardian}: \"I Don't Recognize This\"",
    requestVerifyTitle: "❓ {guardian} requested phone verification call.",
    verifiedOverPhoneBadge: "Senior Confirmed via Twilio Phone Call ✓",
    confirmPayment: "Confirm Payment (Enter PIN)",
    cancelTransfer: "Cancel Transfer",
    frequentContacts: "Frequent Contacts (1-Tap Pay)",
    recentTransactions: "Recent Transactions",
    trustedGuardianTitle: "Trusted Guardian",
    protecting: "Protecting",
    advisoryModeDesc: "🛡️ Advisory Guidance Mode: You provide real-time recommendations with zero screen-sharing or PIN access.",
    switchToUser: "Switch to {user} View",
    incomingRequest: "Incoming Advisory Request from {user}",
    recipientLabel: "Recipient",
    requestedAmount: "Requested Amount",
    spendingBaseline: "Spending Baseline",
    deviation: "deviation",
    whySeeingThis: "Why You're Seeing This: {user} rarely transfers more than ₹1,500. This ₹5,000 transfer triggered the BankSathi Trusted Circle protocol to ask for your advisory second opinion.",
    selectRecommendation: "Select Your Advisory Recommendation:",
    optLooksExpected: "✓ Looks Expected",
    optLooksExpectedSub: "I recognize this recipient and amount.",
    optDontRecognize: "⚠️ Don't Recognize This",
    optDontRecognizeSub: "Warn user of potential scam.",
    optRequestVerify: "❓ Request Verification",
    optRequestVerifySub: "Ask user to verify before paying.",
    twilioCallCardTitle: "📞 Direct Verification Call to Senior (Twilio Voice AI)",
    twilioCallCardDesc: "Trigger an automated, privacy-safe AI phone call to verify this transaction with the senior user. The live conversation will appear below in real-time.",
    seniorPhoneLabel: "Senior's Phone Number",
    callLangLabel: "Call Language",
    startTwilioCallBtn: "🚀 Initiate Twilio Verification Call",
    callingStatus: "Calling Senior on {phone} via Twilio...",
    liveConversationTitle: "🔴 Real-Time Twilio Call Conversation & Transcript",
    noTurnsYet: "Call initiated. Waiting for senior to answer and speak...",
    simulateSeniorYes: "Simulate Senior Spoke: 'Yes, Confirm Transfer'",
    simulateSeniorNo: "Simulate Senior Spoke: 'No, Cancel This'",
    testSecurityBlock: "Test Security: Attempt to confirm payment as {guardian} (Simulate HTTP 403)",
    allClear: "All Clear — No Pending Alerts",
    allClearSub: "{user} has no active anomalous transfers. Click '▶️ Run ₹5,000 Story' above to simulate a new transfer alert.",
    authorizePayment: "Authorize Payment ({user})",
    pinNotice: "Enter your 4-digit UPI PIN. Never share this PIN with anyone, including family members.",
    demoPinLabel: "Demo PIN: 1234",
    confirmAndPay: "Confirm & Pay",
    paymentSuccessful: "Payment Successful",
    referenceLabel: "Reference:",
    doneBtn: "Done",
    saveNames: "Save & Apply Names"
  },
  hi: {
    appTitle: "बैंकसाथी",
    familyShield: "फैमिली शील्ड",
    tagline: "साझा मार्गदर्शन, साझा पहुंच नहीं",
    userTag: "उपयोगकर्ता",
    guardianTag: "अभिभावक",
    runStory: "▶️ 5-चरणीय गाइडेड स्टोरी",
    editNames: "नाम बदलें",
    fontSize: "अक्षर आकार:",
    contrastOn: "हाई कंट्रास्ट चालू",
    contrastOff: "सामान्य कंट्रास्ट",
    shieldActive: "फैमिली शील्ड सक्रिय",
    guardianLabel: "अभिभावक:",
    savingsBalance: "बचत खाता शेष",
    readBalance: "🔊 बैलेंस बोलकर सुनें",
    speakPlaceholder: "बोलें या लिखें: '{recipient} को 5000 भेजो'...",
    scanQr: "QR स्कैन करें",
    payContacts: "संपर्क को भेजें",
    bankTransfer: "बैंक ट्रांसफर",
    trustedCircle: "ट्रस्टेड सर्कल",
    pendingReview: "ट्रांसफर समीक्षा लंबित",
    paying: "भुगतान कर रहे हैं",
    riskAnomaly: "जोखिम विसंगति",
    protectionCheck: "व्यवहार सुरक्षा जांच:",
    trustedAdvisory: "ट्रस्टेड सर्कल सलाह",
    viewAs: "देखें",
    awaitingOpinion: "{guardian} को सलाह अलर्ट भेजा गया। दूसरी राय की प्रतीक्षा...",
    looksExpectedTitle: "✓ {guardian}: \"उचित लग रहा है\"",
    dontRecognizeTitle: "⚠️ {guardian}: \"मैं इसे नहीं पहचानता\"",
    requestVerifyTitle: "❓ {guardian} ने फोन वेरिफिकेशन कॉल का अनुरोध किया।",
    verifiedOverPhoneBadge: "वरिष्ठ नागरिक ने फोन पर पुष्टि की ✓",
    confirmPayment: "भुगतान की पुष्टि करें (पिन डालें)",
    cancelTransfer: "ट्रांसफर रद्द करें",
    frequentContacts: "अक्सर भुगतान किए गए संपर्क (1-टैप पे)",
    recentTransactions: "हाल के लेनदेन",
    trustedGuardianTitle: "विश्वसनीय अभिभावक",
    protecting: "सुरक्षा कर रहे हैं:",
    advisoryModeDesc: "🛡️ सलाहकार मार्गदर्शन मोड: आप बिना स्क्रीन शेयरिंग या पिन के रीयल-टाइम सलाह देते हैं।",
    switchToUser: "{user} के व्यू पर जाएं",
    incomingRequest: "{user} से आने वाला सलाह अनुरोध",
    recipientLabel: "प्राप्तकर्ता",
    requestedAmount: "अनुरोधित राशि",
    spendingBaseline: "सामान्य खर्च बेसलाइन",
    deviation: "विचलन",
    whySeeingThis: "आप इसे क्यों देख रहे हैं: {user} आमतौर पर ₹1,500 से अधिक ट्रांसफर नहीं करते। इस ₹5,000 के ट्रांसफर ने बैंकसाथी ट्रस्टेड सर्कल को आपकी दूसरी राय लेने के लिए सक्रिय किया।",
    selectRecommendation: "अपनी सलाहकार अनुशंसा चुनें:",
    optLooksExpected: "✓ उचित लग रहा है",
    optLooksExpectedSub: "मैं इस प्राप्तकर्ता और राशि को पहचानता हूँ।",
    optDontRecognize: "⚠️ मैं इसे नहीं पहचानता",
    optDontRecognizeSub: "उपयोगकर्ता को संभावित धोखाधड़ी की चेतावनी दें।",
    optRequestVerify: "❓ वेरिफिकेशन का अनुरोध करें",
    optRequestVerifySub: "भुगतान से पहले उपयोगकर्ता को फोन करने के लिए कहें।",
    twilioCallCardTitle: "📞 सीधे वरिष्ठ नागरिक को AI कॉल करें (Twilio Voice AI)",
    twilioCallCardDesc: "वरिष्ठ उपयोगकर्ता के साथ इस लेनदेन की पुष्टि के लिए स्वचालित, सुरक्षित Twilio AI कॉल शुरू करें। पूरी बातचीत नीचे रीयल-टाइम में दिखेगी।",
    seniorPhoneLabel: "वरिष्ठ नागरिक का फोन नंबर",
    callLangLabel: "कॉल की भाषा",
    startTwilioCallBtn: "🚀 Twilio वेरिफिकेशन कॉल शुरू करें",
    callingStatus: "वरिष्ठ नागरिक को {phone} पर कॉल किया जा रहा है...",
    liveConversationTitle: "🔴 रीयल-टाइम Twilio कॉल बातचीत और ट्रांसक्रिप्ट",
    noTurnsYet: "कॉल शुरू हो गई है। उत्तर देने और बोलने की प्रतीक्षा है...",
    simulateSeniorYes: "वरिष्ठ नागरिक ने बोला: 'हाँ, पुष्टि करें'",
    simulateSeniorNo: "वरिष्ठ नागरिक ने बोला: 'नहीं, रद्द करें'",
    testSecurityBlock: "सुरक्षा टेस्ट करें: {guardian} के रूप में भुगतान का प्रयास (HTTP 403)",
    allClear: "सब सुरक्षित है — कोई लंबित अलर्ट नहीं",
    allClearSub: "{user} का कोई असामान्य ट्रांसफर नहीं है। नया अलर्ट देखने के लिए ऊपर '▶️ ₹5,000 स्टोरी चलाएं' पर क्लिक करें।",
    authorizePayment: "भुगतान अधिकृत करें ({user})",
    pinNotice: "अपना 4-अंकों का UPI पिन दर्ज करें। यह पिन कभी भी किसी के साथ साझा न करें।",
    demoPinLabel: "डेमो पिन: 1234",
    confirmAndPay: "पुष्टि करें और भुगतान करें",
    paymentSuccessful: "भुगतान सफल रहा",
    referenceLabel: "संदर्भ क्रमांक:",
    doneBtn: "पूर्ण",
    saveNames: "नाम सहेजें और लागू करें"
  },
  kn: {
    appTitle: "ಬ್ಯಾಂಕ್‌ಸಾಥಿ",
    familyShield: "ಫ್ಯಾಮಿಲಿ ಶೀಲ್ಡ್",
    tagline: "ಹಂಚಿಕೆಯ ಮಾರ್ಗದರ್ಶನ, ಹಂಚಿಕೆಯ ಪ್ರವೇಶವಲ್ಲ",
    userTag: "ಬಳಕೆದಾರ",
    guardianTag: "ರಕ್ಷಕ",
    runStory: "▶️ 5-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ ಕಥೆ",
    editNames: "ಹೆಸರುಗಳನ್ನು ಬದಲಾಯಿಸಿ",
    fontSize: "ಅಕ್ಷರ ಗಾತ್ರ:",
    contrastOn: "ಹೈ ಕಾಂಟ್ರಾಸ್ಟ್ ಆನ್",
    contrastOff: "ಸಾಮಾನ್ಯ ಕಾಂಟ್ರಾಸ್ಟ್",
    shieldActive: "ಫ್ಯಾಮಿಲಿ ಶೀಲ್ಡ್ ಸಕ್ರಿಯವಾಗಿದೆ",
    guardianLabel: "ರಕ್ಷಕ:",
    savingsBalance: "ಉಳಿತಾಯ ಖಾತೆಯ ಬ್ಯಾಲೆನ್ಸ್",
    readBalance: "🔊 ಬ್ಯಾಲೆನ್ಸ್ ಆಡಿಯೋ ಆಲಿಸಿ",
    speakPlaceholder: "ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ: '{recipient} ಅವರಿಗೆ 5000 ಕಳುಹಿಸಿ'...",
    scanQr: "QR ಸ್ಕ್ಯಾನ್",
    payContacts: "ಸಂಪರ್ಕಗಳಿಗೆ ಪಾವತಿಸಿ",
    bankTransfer: "ಬ್ಯಾಂಕ್ ವರ್ಗಾವಣೆ",
    trustedCircle: "ಟ್ರಸ್ಟೆಡ್ ಸರ್ಕಲ್",
    pendingReview: "ವರ್ಗಾವಣೆ ಪರಿಶೀಲನೆ ಬಾಕಿಯಿದೆ",
    paying: "ಪಾವತಿಸಲಾಗುತ್ತಿದೆ",
    riskAnomaly: "ಅಪಾಯದ ಅಸಹಜತೆ",
    protectionCheck: "ವರ್ತನೆಯ ಸುರಕ್ಷತಾ ತಪಾಸಣೆ:",
    trustedAdvisory: "ಟ್ರಸ್ಟೆಡ್ ಸರ್ಕಲ್ ಸಲಹೆ",
    viewAs: "ವೀಕ್ಷಿಸಿ",
    awaitingOpinion: "{guardian} ಅವರಿಗೆ ಸಲಹಾ ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ. ಪ್ರತಿಕ್ರಿಯೆಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...",
    looksExpectedTitle: "✓ {guardian}: \"ಸರಿಯಾಗಿ ಕಾಣುತ್ತಿದೆ\"",
    dontRecognizeTitle: "⚠️ {guardian}: \"ನನಗೆ ಇದು ಗೊತ್ತಿಲ್ಲ\"",
    requestVerifyTitle: "❓ {guardian} ಅವರು ಕರೆ ಪರಿಶೀಲನೆ ಕೇಳಿದ್ದಾರೆ.",
    verifiedOverPhoneBadge: "ಹಿರಿಯ ನಾಗರಿಕರು ಫೋನ್‌ನಲ್ಲಿ ದೃಢಪಡಿಸಿದ್ದಾರೆ ✓",
    confirmPayment: "ಪಾವತಿ ದೃಢೀಕರಿಸಿ (ಪಿನ್ ನಮೂದಿಸಿ)",
    cancelTransfer: "ವರ್ಗಾವಣೆ ರದ್ದುಮಾಡಿ",
    frequentContacts: "ಆಗಾಗ್ಗೆ ಪಾವತಿಸಿದ ಸಂಪರ್ಕಗಳು",
    recentTransactions: "ಇತ್ತೀಚಿನ ವಹಿವಾಟುಗಳು",
    trustedGuardianTitle: "ವಿಶ್ವಾಸಾರ್ಹ ರಕ್ಷಕ",
    protecting: "ರಕ್ಷಿಸುತ್ತಿದ್ದಾರೆ:",
    advisoryModeDesc: "🛡️ ಸಲಹಾ ಮಾರ್ಗದರ್ಶನ ಮೋಡ್: ಸ್ಕ್ರೀನ್ ಶೇರಿಂಗ್ ಅಥವಾ ಪಿನ್ ಇಲ್ಲದೆ ನೈಜ-ಸಮಯದ ಸಲಹೆ ನೀಡುತ್ತೀರಿ.",
    switchToUser: "{user} ಅವರ ವೀಕ್ಷಣೆಗೆ ಬದಲಾಯಿಸಿ",
    incomingRequest: "{user} ಅವರಿಂದ ಬಂದ ಸಲಹಾ ವಿನಂತಿ",
    recipientLabel: "ಸ್ವೀಕೃತದಾರ",
    requestedAmount: "ಕೋರಿದ ಮೊತ್ತ",
    spendingBaseline: "ಸಾನ್ಯ ವೆಚ್ಚದ ಮಿತಿ",
    deviation: "ವ್ಯತ್ಯಾಸ",
    whySeeingThis: "ನೀವು ಇದನ್ನು ಏಕೆ ನೋಡುತ್ತಿದ್ದೀರಿ: {user} ಅವರು ಸಾಮಾನ್ಯವಾಗಿ ₹1,500 ಕ್ಕಿಂತ ಹೆಚ್ಚು ಕಳುಹಿಸುವುದಿಲ್ಲ. ಈ ₹5,000 ವಹಿವಾಟು ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ ಪಡೆಯಲು ಬ್ಯಾಂಕ್‌ಸಾಥಿ ರಕ್ಷಣೆಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿದೆ.",
    selectRecommendation: "ನಿಮ್ಮ ಸಲಹೆಯನ್ನು ಆರಿಸಿ:",
    optLooksExpected: "✓ ಸರಿಯಾಗಿ ಕಾಣುತ್ತಿದೆ",
    optLooksExpectedSub: "ನಾನು ಈ ವ್ಯಕ್ತಿ ಮತ್ತು ಮೊತ್ತವನ್ನು ಗುರುತಿಸುತ್ತೇನೆ.",
    optDontRecognize: "⚠️ ನನಗೆ ಇದು ಗೊತ್ತಿಲ್ಲ",
    optDontRecognizeSub: "ವಂಚನೆಯ ಸಾಧ್ಯತೆಯ ಬಗ್ಗೆ ಬಳಕೆದಾರರನ್ನು ಎಚ್ಚರಿಸಿ.",
    optRequestVerify: "❓ ಪರಿಶೀಲನೆಗೆ ವಿನಂತಿಸಿ",
    optRequestVerifySub: "ಪಾವತಿಸುವ ಮುನ್ನ ಕರೆ ಮಾಡಲು ತಿಳಿಸಿ.",
    twilioCallCardTitle: "📞 ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ನೇರ AI ಕರೆ ಮಾಡಿ (Twilio Voice AI)",
    twilioCallCardDesc: "ವಹಿವಾಟನ್ನು ದೃಢೀಕರಿಸಲು ಹಿರಿಯ ಬಳಕೆದಾರರಿಗೆ ಸ್ವಯಂಚಾಲಿತ Twilio AI ಕರೆ ಪ್ರಾರಂಭಿಸಿ. ಸಂಪೂರ್ಣ ಮಾತುಕತೆ ಕೆಳಗೆ ನೈಜ ಸಮಯದಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ.",
    seniorPhoneLabel: "ಹಿರಿಯ ನಾಗರಿಕರ ಫೋನ್ ಸಂಖ್ಯೆ",
    callLangLabel: "ಕರೆಯ ಭಾಷೆ",
    startTwilioCallBtn: "🚀 Twilio ಪರಿಶೀಲನಾ ಕರೆ ಪ್ರಾರಂಭಿಸಿ",
    callingStatus: "ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ {phone} ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    liveConversationTitle: "🔴 ರಿಯಲ್-ಟೈಮ್ Twilio ಕರೆ ಮಾತುಕತೆ ಮತ್ತು ಟ್ರಾನ್ಸ್‌ಸ್ಕ್ರಿಪ್ಟ್",
    noTurnsYet: "ಕರೆ ಪ್ರಾರಂಭವಾಗಿದೆ. ಉತ್ತರಿಸಲು ಮತ್ತು ಮಾತನಾಡಲು ಕಾಯಲಾಗುತ್ತಿದೆ...",
    simulateSeniorYes: "ಹಿರಿಯ ನಾಗರಿಕರು ಹೇಳಿದರು: 'ಹೌದು, ದೃಢೀಕರಿಸಿ'",
    simulateSeniorNo: "ಹಿರಿಯ ನಾಗರಿಕರು ಹೇಳಿದರು: 'ಇಲ್ಲ, ರದ್ದುಮಾಡಿ'",
    testSecurityBlock: "ಭದ್ರತಾ ಪರೀಕ್ಷೆ: {guardian} ಆಗಿ ಪಾವತಿಸಲು ಯತ್ನಿಸಿ (HTTP 403)",
    allClear: "ಎಲ್ಲವೂ ಸುರಕ್ಷಿತವಾಗಿದೆ — ಯಾವುದೇ ಬಾಕಿ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ",
    allClearSub: "{user} ಅವರಿಗೆ ಯಾವುದೇ ಅಸಹಜ ವಹಿವಾಟುಗಳಿಲ್ಲ. ಹೊಸ ಎಚ್ಚರಿಕೆ ನೋಡಲು ಮೇಲಿನ '▶️ ₹5,000 ಕಥೆ ಚಾಲನೆ ಮಾಡಿ' ಕ್ಲಿಕ್ ಮಾಡಿ.",
    authorizePayment: "ಪಾವತಿಯನ್ನು ಅಧಿಕೃತಗೊಳಿಸಿ ({user})",
    pinNotice: "ನಿಮ್ಮ 4-ಅಂಕಿಯ UPI ಪಿನ್ ನಮೂದಿಸಿ. ಈ ಪಿನ್ ಅನ್ನು ಕುಟುಂಬ ಸದಸ್ಯರೂ ಸೇರಿದಂತೆ ಯಾರಿಗೂ ಹಂಚಿಕೊಳ್ಳಬೇಡಿ.",
    demoPinLabel: "ಡೆಮೊ ಪಿನ್: 1234",
    confirmAndPay: "ದೃಢೀಕರಿಸಿ ಮತ್ತು ಪಾವತಿಸಿ",
    paymentSuccessful: "ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ",
    referenceLabel: "ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ:",
    doneBtn: "ಮುಕ್ತಾಯ",
    saveNames: "ಹೆಸರುಗಳನ್ನು ಉಳಿಸಿ ಮತ್ತು ಅನ್ವಯಿಸಿ"
  },
  mr: {
    appTitle: "बँकसाथी",
    familyShield: "फॅमिली शील्ड",
    tagline: "सामायिक मार्गदर्शन, सामायिक प्रवेश नाही",
    userTag: "वापरकर्ता",
    guardianTag: "पालक",
    runStory: "▶️ 5-टप्प्यांची मार्गदर्शित कथा",
    editNames: "नावे बदला",
    fontSize: "फॉन्ट आकार:",
    contrastOn: "हाय कॉन्ट्रास्ट चालू",
    contrastOff: "सामान्य कॉन्ट्रास्ट",
    shieldActive: "फॅमिली शील्ड सक्रिय",
    guardianLabel: "पालक:",
    savingsBalance: "बचत खाते शिल्लक",
    readBalance: "🔊 शिल्लक ऐका",
    speakPlaceholder: "बोला किंवा लिहा: '{recipient} यांना 5000 पाठवा'...",
    scanQr: "QR स्कॅन करा",
    payContacts: "संपर्कांना पाठवा",
    bankTransfer: "बँक ट्रान्सफर",
    trustedCircle: "ट्रस्टेड सर्कल",
    pendingReview: "ट्रान्सफर पुनरावलोकन प्रलंबित",
    paying: "पैसे पाठवत आहात",
    riskAnomaly: "धोका विसंगती",
    protectionCheck: "वर्तन संरक्षण तपासणी:",
    trustedAdvisory: "ट्रस्टेड सर्कल सल्ला",
    viewAs: "पहा",
    awaitingOpinion: "{guardian} यांना सल्ला पाठवला. दुसऱ्या मताची वाट पाहत आहे...",
    looksExpectedTitle: "✓ {guardian}: \"योग्य वाटत आहे\"",
    dontRecognizeTitle: "⚠️ {guardian}: \"मी ओळखत नाही\"",
    requestVerifyTitle: "❓ {guardian} यांनी फोन पडताळणीची विनंती केली.",
    verifiedOverPhoneBadge: "वरिष्ठ नागरिकांनी फोनवर पुष्टी केली ✓",
    confirmPayment: "पेमेंट निश्चित करा (पिन टाका)",
    cancelTransfer: "ट्रान्सफर रद्द करा",
    frequentContacts: "वारंवार पैसे पाठवलेले संपर्क",
    recentTransactions: "अलीकडील व्यवहार",
    trustedGuardianTitle: "विश्वासू पालक",
    protecting: "संरक्षण करत आहेत:",
    advisoryModeDesc: "🛡️ सल्लागार मार्गदर्शन मोड: स्क्रीन शेअरिंग किंवा पिनशिवाय रिअल-टाइम सल्ला द्या.",
    switchToUser: "{user} च्या व्ह्यूवर जा",
    incomingRequest: "{user} कडून सल्ला विनंती",
    recipientLabel: "प्राप्तकर्ता",
    requestedAmount: "मागितलेली रक्कम",
    spendingBaseline: "नेहमीचा खर्च मर्यादा",
    deviation: "फरक",
    whySeeingThis: "तुम्हाला हे का दिसत आहे: {user} सहसा ₹1,500 पेक्षा जास्त पाठवत नाहीत. या ₹5,000 च्या व्यवहाराने तुमचे मत घेण्यासाठी अलर्ट पाठवला आहे.",
    selectRecommendation: "तुमचा सल्ला निवडा:",
    optLooksExpected: "✓ योग्य वाटत आहे",
    optLooksExpectedSub: "मी या प्राप्तकर्त्याला आणि रकमेला ओळखतो.",
    optDontRecognize: "⚠️ मी ओळखत नाही",
    optDontRecognizeSub: "वापरकर्त्याला संभाव्य फसवणुकीबद्दल सावध करा.",
    optRequestVerify: "❓ पडताळणीची विनंती करा",
    optRequestVerifySub: "पैसे पाठवण्यापूर्वी कॉल करण्यास सांगा.",
    twilioCallCardTitle: "📞 थेट वरिष्ठ नागरिकांना AI कॉल करा (Twilio Voice AI)",
    twilioCallCardDesc: "या व्यवहाराची पुष्टी करण्यासाठी वरिष्ठ वापरकर्त्याला सुरक्षित Twilio AI कॉल सुरू करा. संपूर्ण संभाषण खाली रिअल-टाइममध्ये दिसेल.",
    seniorPhoneLabel: "वरिष्ठ नागरिकांचा फोन नंबर",
    callLangLabel: "कॉल भाषा",
    startTwilioCallBtn: "🚀 Twilio पडताळणी कॉल सुरू करा",
    callingStatus: "{phone} वर वरिष्ठ नागरिकांना कॉल करत आहे...",
    liveConversationTitle: "🔴 रिअल-टाइम Twilio कॉल संभाषण आणि ट्रान्सक्रिप्ट",
    noTurnsYet: "कॉल सुरू झाला. उत्तराची वाट पाहत आहे...",
    simulateSeniorYes: "वरिष्ठ नागरिक बोलले: 'होय, पुष्टी करा'",
    simulateSeniorNo: "वरिष्ठ नागरिक बोलले: 'नाही, रद्द करा'",
    testSecurityBlock: "सुरक्षा चाचणी: {guardian} म्हणून पेमेंटचा प्रयत्न करा (HTTP 403)",
    allClear: "सर्व सुरक्षित — कोणतेही प्रलंबित अलर्ट नाहीत",
    allClearSub: "{user} चे कोणतेही असामान्य व्यवहार नाहीत. नवीन अलर्ट पाहण्यासाठी '▶️ ₹5,000 कथा चालवा' वर क्लिक करा.",
    authorizePayment: "पेमेंट अधिकृत करा ({user})",
    pinNotice: "तुमचा 4-अंकी UPI पिन टाका. हा पिन कोणाशीही शेअर करू नका.",
    demoPinLabel: "डेमो पिन: 1234",
    confirmAndPay: "पुष्टी करा आणि पैसे पाठवा",
    paymentSuccessful: "पेमेंट यशस्वी झाले",
    referenceLabel: "संदर्भ क्रमांक:",
    doneBtn: "पूर्ण",
    saveNames: "नावे जतन करा आणि लागू करा"
  },
  ta: {
    appTitle: "பேங்க் சாதி",
    familyShield: "குடும்ப பாதுகாப்பு",
    tagline: "பகிர்ந்த வழிகாட்டுதல், பகிர்ந்த அணுகல் அல்ல",
    userTag: "பயனர்",
    guardianTag: "பாதுகாவலர்",
    runStory: "▶️ 5-படி வழிகாட்டப்பட்ட கதை",
    editNames: "பெயர்களை மாற்று",
    fontSize: "எழுத்து அளவு:",
    contrastOn: "உயர் மாறுபாடு ஆன்",
    contrastOff: "இயல்பான மாறுபாடு",
    shieldActive: "குடும்ப பாதுகாப்பு செயலில் உள்ளது",
    guardianLabel: "பாதுகாவலர்:",
    savingsBalance: "சேமிப்பு கணக்கு இருப்பு",
    readBalance: "🔊 இருப்பை குரலில் கேளுங்கள்",
    speakPlaceholder: "பேசுங்கள் அல்லது தட்டச்சு செய்யுங்கள்: '{recipient} க்கு 5000 அனுப்பு'...",
    scanQr: "QR ஸ்கேன்",
    payContacts: "தொடர்புகளுக்கு செலுத்துங்கள்",
    bankTransfer: "வங்கி பரிமாற்றம்",
    trustedCircle: "நம்பகமான வட்டம்",
    pendingReview: "பரிவர்த்தனை மதிப்பாய்வு நிலுவையில் உள்ளது",
    paying: "செலுத்துகிறீர்கள்",
    riskAnomaly: "ஆபத்து முரண்பாடு",
    protectionCheck: "நடத்தை பாதுகாப்பு சரிபார்ப்பு:",
    trustedAdvisory: "நம்பகமான வட்ட ஆலோசனை",
    viewAs: "பார்க்கவும்",
    awaitingOpinion: "{guardian} க்கு ஆலோசனை எச்சரிக்கை அனுப்பப்பட்டது. பதிலுக்காக காத்திருக்கிறது...",
    looksExpectedTitle: "✓ {guardian}: \"சரியாக உள்ளது\"",
    dontRecognizeTitle: "⚠️ {guardian}: \"எனக்கு தெரியவில்லை\"",
    requestVerifyTitle: "❓ {guardian} அழைப்பு சரிபார்ப்பை கோரியுள்ளார்.",
    verifiedOverPhoneBadge: "மூத்த குடிமகன் தொலைபேசியில் உறுதிப்படுத்தினார் ✓",
    confirmPayment: "பரிவர்த்தனையை உறுதிப்படுத்தவும் (பின் உள்ளிடவும்)",
    cancelTransfer: "பரிவர்த்தனையை ரத்துசெய்",
    frequentContacts: "அடிக்கடி பணம் அனுப்பிய தொடர்புகள்",
    recentTransactions: "சமீபத்திய பரிவர்த்தனைகள்",
    trustedGuardianTitle: "நம்பகமான பாதுகாவலர்",
    protecting: "பாதுகாக்கிறார்:",
    advisoryModeDesc: "🛡️ ஆலோசனை வழிகாட்டுதல் பயன்முறை: திரை பகிர்வு அல்லது பின் இல்லாமல் நிகழ்நேர பரிந்துரைகளை வழங்குகிறீர்கள்.",
    switchToUser: "{user} பார்வைக்கு மாறவும்",
    incomingRequest: "{user} இடமிருந்து வந்த ஆலோசனை கோரிக்கை",
    recipientLabel: "பெறுநர்",
    requestedAmount: "கோரப்பட்ட தொகை",
    spendingBaseline: "வழக்கமான செலவு வரம்பு",
    deviation: "மாறுபாடு",
    whySeeingThis: "இதை நீங்கள் ஏன் பார்க்கிறீர்கள்: {user} வழக்கமாக ₹1,500 க்கு மேல் அனுப்புவதில்லை. இந்த ₹5,000 பரிவர்த்தனை உங்கள் ஆலோசனையைக் கோருகிறது.",
    selectRecommendation: "உங்கள் ஆலோசனை பரிந்துரையைத் தேர்ந்தெடுக்கவும்:",
    optLooksExpected: "✓ சரியாக உள்ளது",
    optLooksExpectedSub: "நான் இந்த நபரையும் தொகையையும் அங்கீகரிக்கிறேன்.",
    optDontRecognize: "⚠️ எனக்கு தெரியவில்லை",
    optDontRecognizeSub: "சாத்தியமான மோசடி குறித்து பயனரை எச்சரிக்கவும்.",
    optRequestVerify: "❓ சரிபார்ப்பைக் கோருங்கள்",
    optRequestVerifySub: "செலுத்துவதற்கு முன் அழைக்குமாறு கூறவும்.",
    twilioCallCardTitle: "📞 மூத்த குடிமகனுக்கு நேரடி AI அழைப்பு (Twilio Voice AI)",
    twilioCallCardDesc: "பரிவர்த்தனையை உறுதிப்படுத்த மூத்த பயனருக்கு பாதுகாப்பான Twilio AI குரல் அழைப்பைத் தொடங்கவும். நேரடி உரையாடல் கீழே தோன்றும்.",
    seniorPhoneLabel: "மூத்த குடிமகனின் தொலைபேசி எண்",
    callLangLabel: "அழைப்பு மொழி",
    startTwilioCallBtn: "🚀 Twilio சரிபார்ப்பு அழைப்பைத் தொடங்கு",
    callingStatus: "மூத்த பயனருக்கு {phone} இல் அழைக்கப்படுகிறது...",
    liveConversationTitle: "🔴 நிகழ்நேர Twilio அழைப்பு உரையாடல் மற்றும் டிரான்ஸ்கிரிப்ட்",
    noTurnsYet: "அழைப்பு தொடங்கப்பட்டது. மூத்த குடிமகன் பேச காத்திருக்கிறது...",
    simulateSeniorYes: "மூத்த பயனர் கூறினார்: 'ஆம், உறுதிப்படுத்துங்கள்'",
    simulateSeniorNo: "மூத்த பயனர் கூறினார்: 'இல்லை, ரத்து செய்யுங்கள்'",
    testSecurityBlock: "பாதுகாப்பு சோதனை: {guardian} ஆக பணம் செலுத்த முயற்சிக்கவும் (HTTP 403)",
    allClear: "அனைத்தும் பாதுகாப்பானது — நிலுவையில் உள்ள எச்சரிக்கைகள் இல்லை",
    allClearSub: "{user} க்கு எந்த அசாதாரண பரிவர்த்தனைகளும் இல்லை. புதிய விழிப்பூட்டலைக் காண '▶️ ₹5,000 கதையை இயக்கு' என்பதைக் கிளிக் செய்க.",
    authorizePayment: "பரிவர்த்தனையை அங்கீகரிக்கவும் ({user})",
    pinNotice: "உங்கள் 4 இலக்க UPI பின்னை உள்ளிடவும். இந்த பின்னை யாரிடமும் பகிர வேண்டாம்.",
    demoPinLabel: "டெமோ பின்: 1234",
    confirmAndPay: "உறுதிப்படுத்தி செலுத்தவும்",
    paymentSuccessful: "பரிவர்த்தனை வெற்றிகரமாக முடிந்தது",
    referenceLabel: "குறிப்பு எண்:",
    doneBtn: "முடிந்தது",
    saveNames: "பெயர்களைச் சேமித்து பயன்படுத்துக"
  }
};

const TOUR_STEPS = [
  {
    step: 1,
    title: "1. Senior Initiates Transfer",
    subtitle: "Sunita Verma speaks voice transfer of ₹5,000 to Rohan Sharma.",
    narrative: "Step 1: Senior user Sunita Verma attempts a ₹5,000 transfer. The behavioral risk engine detects a 3.3x baseline deviation and sends a Trusted Circle advisory alert to Dilshan.",
    actionPrompt: "Action: Click 'Next Step ➡️' or view the active alert card below."
  },
  {
    step: 2,
    title: "2. Guardian Advisory & Phone Call",
    subtitle: "Dilshan receives alert & verifies with Sunita over Twilio AI Voice Call.",
    narrative: "Step 2: Dilshan opens his Trusted Guardian dashboard, triggers an automated Twilio verification call to Sunita. Sunita confirms 'Yes' over the phone.",
    actionPrompt: "Action: Guardian reviews live transcript and submits '✓ Looks Expected' recommendation."
  },
  {
    step: 3,
    title: "3. Server-Side Block (HTTP 403)",
    subtitle: "Demonstrates that Guardian CANNOT execute payment or enter PIN.",
    narrative: "Step 3: Security Rule: 'Shared guidance, not shared access.' When helper attempts to pay, backend returns HTTP 403 Forbidden.",
    actionPrompt: "Action: Demonstrates zero credential leakage and zero proxy payments."
  },
  {
    step: 4,
    title: "4. Senior Step-Up Authorization",
    subtitle: "Sunita sees '✓ Dilshan Verified' badge and enters her UPI PIN.",
    narrative: "Step 4: Sunita Verma sees the verified badge from Dilshan. She enters her own 4-digit UPI PIN (1234) on her own device.",
    actionPrompt: "Action: Senior enters PIN 1234 to complete final authorization."
  },
  {
    step: 5,
    title: "5. Safe Settlement & Digital Receipt",
    subtitle: "Funds transferred with full immutable Trusted Circle audit record.",
    narrative: "Step 5: Transfer complete! ₹5,000 sent safely. Bank balance updated, and a digital receipt with cryptographic audit reference is generated.",
    actionPrompt: "Action: Story complete. Click 'Restart Tour' to practice again."
  }
];

export default function BankSathiApp() {
  const [userName, setUserName] = useState('Sunita Verma');
  const [guardianName, setGuardianName] = useState('Dilshan');
  const [guardianRelation, setGuardianRelation] = useState('Son & Trusted Guardian');
  const [demoRecipientName, setDemoRecipientName] = useState('Rohan Sharma');
  const [showEditNamesModal, setShowEditNamesModal] = useState(false);

  const [activePersona, setActivePersona] = useState<'user' | 'guardian'>('user');

  // Guided Walkthrough State
  const [tourStep, setTourStep] = useState<number>(1);
  const [isTourActive, setIsTourActive] = useState<boolean>(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  const [fontScale, setFontScale] = useState(1.0);
  const [highContrast, setHighContrast] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'kn' | 'mr' | 'ta'>('en');
  const [showBalance, setShowBalance] = useState(true);

  const [userBalance, setUserBalance] = useState(50000);
  const [guardianBalance, setGuardianBalance] = useState(142000);

  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [syncCaption, setSyncCaption] = useState('');
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const [seniorPhoneNumber, setSeniorPhoneNumber] = useState('+919461284678');
  const [callLanguage, setCallLanguage] = useState<'en' | 'hi' | 'kn' | 'mr' | 'ta'>('en');
  const [isCallingSenior, setIsCallingSenior] = useState(false);
  const [callStatusMessage, setCallStatusMessage] = useState('');
  const [callConversationTurns, setCallConversationTurns] = useState<CallTurn[]>([]);
  const [callPollingInterval, setCallPollingInterval] = useState<any>(null);

  const [frequentPeople, setFrequentPeople] = useState<Person[]>([
    { name: 'Rohan Sharma', upiId: 'rohan.sharma@okaxis', avatar: '👨🏽', color: 'bg-emerald-600', lastPaid: '₹1,500 · 2 weeks ago', baseline: 1500 },
    { name: 'Dilshan Kumar', upiId: 'dilshan.k@okhdfcbank', avatar: '👨🏻‍💼', color: 'bg-purple-600', lastPaid: '₹5,000 · 1 month ago', baseline: 5000 },
    { name: 'Priya Verma', upiId: 'priya.verma@okicici', avatar: '👩🏻‍💻', color: 'bg-blue-600', lastPaid: '₹3,200 · 3 weeks ago', baseline: 3000 },
    { name: 'City Grocery & Kirana', upiId: 'grocery@paytm', avatar: '🏪', color: 'bg-amber-600', lastPaid: '₹850 · 3 days ago', baseline: 1000 },
    { name: 'Unknown Lottery Agent', upiId: 'unknown.win99@ybl', avatar: '🕵️', color: 'bg-red-600', lastPaid: 'No history', baseline: 0 },
  ]);

  const [activeTransfer, setActiveTransfer] = useState<TransferAlert | null>({
    id: 'TXN-ALERT-8819',
    senderName: 'Sunita Verma',
    senderPhone: '9999999001',
    recipientName: 'Rohan Sharma',
    upiId: 'rohan.sharma@okaxis',
    amount: 5000,
    baselineAmount: 1500,
    riskTier: 'HIGH',
    riskReason: 'Amount ₹5,000 exceeds regular spending baseline of ₹1,500 (3.3x deviation). Trusted Circle advisory alert dispatched to Dilshan.',
    timestamp: 'Just Now',
    advisoryStatus: 'PENDING',
    finalStatus: 'PENDING_ADVISORY'
  });

  const [transactions, setTransactions] = useState<any[]>([
    {
      id: 'TXN-UPI-9941',
      recipient: 'City Grocery & Kirana',
      upi: 'grocery@paytm',
      amount: 850,
      date: '01 Sep 2026',
      status: 'SUCCESS',
      advisory: 'Low Risk · Regular Expense'
    },
    {
      id: 'TXN-UPI-9920',
      recipient: 'Priya Verma',
      upi: 'priya.verma@okicici',
      amount: 3200,
      date: '28 Aug 2026',
      status: 'SUCCESS',
      advisory: 'Low Risk · Verified Contact'
    }
  ]);

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState<any>(null);
  const [serverErrorAlert, setServerErrorAlert] = useState('');

  const recognitionRef = useRef<any>(null);

  const t = (key: string, variables: Record<string, string> = {}) => {
    const langDict = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;
    let str = langDict[key] || TRANSLATIONS.en[key] || key;
    for (const [vKey, vVal] of Object.entries(variables)) {
      str = str.replace(new RegExp(`\\{${vKey}\\}`, 'g'), vVal);
    }
    return str;
  };

  const speakVoice = (text: string) => {
    setSyncCaption(text);
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      const langCodeMap: Record<string, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        kn: 'kn-IN',
        mr: 'mr-IN',
        ta: 'ta-IN'
      };
      utterance.lang = langCodeMap[selectedLanguage] || 'en-IN';

      const voices = window.speechSynthesis.getVoices();
      const matchVoice = voices.find(v => 
        v.lang.toLowerCase().includes(selectedLanguage) || 
        v.lang.includes('IN') || 
        v.name.includes('India') || 
        v.name.includes('Aditi')
      );
      if (matchVoice) utterance.voice = matchVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech error:', e);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // 🧭 GUIDED TOUR CONTROLLER & AUTOMATION
  // ───────────────────────────────────────────────────────────────────────────
  const executeTourStep = (stepNumber: number) => {
    setTourStep(stepNumber);
    setIsTourActive(true);

    if (stepNumber === 1) {
      setActivePersona('user');
      const demoAlert: TransferAlert = {
        id: 'TXN-DEMO-5000',
        senderName: userName,
        senderPhone: seniorPhoneNumber,
        recipientName: demoRecipientName,
        upiId: `${demoRecipientName.toLowerCase().replace(/\s+/g, '.')}@okaxis`,
        amount: 5000,
        baselineAmount: 1500,
        riskTier: 'HIGH',
        riskReason: `Transfer of ₹5,000 is 3.3x higher than regular ₹1,500 baseline. Trusted Circle advisory alert dispatched to ${guardianName}.`,
        timestamp: 'Just Now',
        advisoryStatus: 'PENDING',
        finalStatus: 'PENDING_ADVISORY'
      };
      setActiveTransfer(demoAlert);
      setShowPinModal(false);
      setShowReceiptModal(null);
      setServerErrorAlert('');
      setCallConversationTurns([]);
      setCallStatusMessage('');
      speakVoice(`Step 1: ${userName} is sending ₹5,000 to ${demoRecipientName}. The risk engine detected the baseline deviation and sent an advisory alert to ${guardianName}.`);
    } else if (stepNumber === 2) {
      setActivePersona('guardian');
      setShowPinModal(false);
      setShowReceiptModal(null);
      // Simulate live Twilio conversation turns
      setCallConversationTurns([
        {
          id: 'TC-TOUR-1',
          event_type: 'TRUSTED_CIRCLE_CALL_INITIATED',
          actor: `Guardian (${guardianName})`,
          action: `Initiated Twilio Verification Call to ${userName}`,
          decision: 'CALLING',
          notes: `🤖 AI Voice Shield (Twilio): "Hello ${userName}! Your guardian ${guardianName} requested verification for ₹5,000 to ${demoRecipientName}. Say 'Yes' to confirm or 'No' to cancel."`
        },
        {
          id: 'TC-TOUR-2',
          event_type: 'TRUSTED_CIRCLE_CONFIRMED',
          actor: `Senior (${userName})`,
          action: `Confirmed ₹5,000 Over Phone Call`,
          decision: 'CONFIRMED',
          notes: `👵 ${userName}: "Yes, I am sending this ₹5,000 for festival shopping."\n🤖 AI Voice Shield: "Thank you ${userName}! Transfer verified. ${guardianName} notified."`
        }
      ]);
      setCallStatusMessage(`✓ ${userName} confirmed the transfer over Twilio phone call!`);
      if (activeTransfer) {
        setActiveTransfer({
          ...activeTransfer,
          advisoryStatus: 'LOOKS_EXPECTED',
          verifiedOverPhone: true,
          guardianNote: `Phone verification complete: ${userName} confirmed authorization over Twilio call.`
        });
      }
      speakVoice(`Step 2: Switched to Guardian ${guardianName}. Verification call was placed to ${userName}, and she confirmed over the phone.`);
    } else if (stepNumber === 3) {
      setActivePersona('guardian');
      setShowPinModal(false);
      setShowReceiptModal(null);
      setServerErrorAlert(`HTTP 403 Forbidden: "Shared guidance, not shared access." Trusted Circle guardians (${guardianName}) cannot execute or confirm payments. Only ${userName} holds authorization authority.`);
      speakVoice(`Step 3: Security Rule: Guardian cannot authorize payments or enter PIN. Authorization authority belongs strictly to ${userName}.`);
    } else if (stepNumber === 4) {
      setActivePersona('user');
      setServerErrorAlert('');
      setShowReceiptModal(null);
      setShowPinModal(true);
      setPinInput('1234');
      speakVoice(`Step 4: Switched to ${userName}. She sees the verified badge from ${guardianName} and enters her private UPI PIN to authorize.`);
    } else if (stepNumber === 5) {
      setActivePersona('user');
      setShowPinModal(false);
      const newBal = userBalance - 5000;
      setUserBalance(newBal);
      const receipt = {
        id: activeTransfer?.id || 'TXN-DEMO-5000',
        recipient: demoRecipientName,
        upi: `${demoRecipientName.toLowerCase().replace(/\s+/g, '.')}@okaxis`,
        amount: 5000,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'SUCCESS',
        advisory: `${guardianName} & Phone Verified ✓`
      };
      setTransactions(prev => [receipt, ...prev]);
      setActiveTransfer(null);
      setShowReceiptModal(receipt);
      speakVoice(`Step 5: Payment Successful! ₹5,000 sent safely. Digital receipt generated with complete Trusted Circle and Twilio call verification audit trail.`);
    }
  };

  const handleNextStep = () => {
    const next = tourStep >= 5 ? 1 : tourStep + 1;
    executeTourStep(next);
  };

  const handlePrevStep = () => {
    const prev = tourStep <= 1 ? 5 : tourStep - 1;
    executeTourStep(prev);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  useEffect(() => {
    let timer: any = null;
    if (isAutoPlaying) {
      timer = setTimeout(() => {
        if (tourStep < 5) {
          executeTourStep(tourStep + 1);
        } else {
          setIsAutoPlaying(false);
        }
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isAutoPlaying, tourStep]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        const langMap: Record<string, string> = {
          en: 'en-IN',
          hi: 'hi-IN',
          kn: 'kn-IN',
          mr: 'mr-IN',
          ta: 'ta-IN'
        };
        reco.lang = langMap[selectedLanguage] || 'en-IN';

        reco.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setVoiceTranscript(text);
          if (event.results[0].isFinal) {
            setIsListening(false);
            handleVoiceCommand(text);
          }
        };

        reco.onerror = () => setIsListening(false);
        reco.onend = () => setIsListening(false);
        recognitionRef.current = reco;
      }
    }
  }, [selectedLanguage, userBalance, userName, guardianName]);

  useEffect(() => {
    setCallLanguage(selectedLanguage);
  }, [selectedLanguage]);

  const fetchLiveCallConversation = async (transferId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/cases/voice/conversation/${transferId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.conversation) {
        setCallConversationTurns(data.conversation);
        if (data.latest_decision === 'CONFIRMED') {
          setActiveTransfer(prev => prev ? {
            ...prev,
            advisoryStatus: 'LOOKS_EXPECTED',
            verifiedOverPhone: true,
            guardianNote: `Phone verification complete: ${userName} confirmed authorization over Twilio call.`
          } : null);
          setCallStatusMessage(`✓ ${userName} confirmed the transfer over Twilio phone call!`);
        } else if (data.latest_decision === 'REJECTED') {
          setActiveTransfer(prev => prev ? {
            ...prev,
            advisoryStatus: 'DONT_RECOGNIZE',
            guardianNote: `Phone verification alert: ${userName} cancelled or rejected transfer over phone call.`
          } : null);
          setCallStatusMessage(`⚠️ ${userName} cancelled this transfer during the phone call!`);
        }
      }
    } catch (e) {
      console.warn('Live poll error:', e);
    }
  };

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setIsListening(true);
        setVoiceTranscript('');
        recognitionRef.current.start();
        
        let promptText = `Hello ${userName}, who would you like to send money to?`;
        if (selectedLanguage === 'hi') promptText = `नमस्ते ${userName}, किसको कितने पैसे भेजने हैं?`;
        if (selectedLanguage === 'kn') promptText = `ನಮಸ್ಕಾರ ${userName}, ಯಾರಿಗೆ ಹಣ ಕಳುಹಿಸಬೇಕು?`;
        if (selectedLanguage === 'mr') promptText = `नमस्कार ${userName}, कोणाला पैसे पाठवायचे आहेत?`;
        if (selectedLanguage === 'ta') promptText = `வணக்கம் ${userName}, யாருக்கு பணம் அனுப்ப வேண்டும்?`;
        
        speakVoice(promptText);
      } else {
        alert('Speech recognition is not supported in this browser. Please use the quick action buttons.');
      }
    }
  };

  const handleVoiceCommand = (text: string) => {
    const clean = text.toLowerCase();
    let amount = 5000;
    const numMatch = clean.match(/(\d+(?:,\d+)*)/);
    if (numMatch) {
      amount = parseInt(numMatch[1].replace(/,/g, ''));
    }

    let recipient = demoRecipientName;
    if (clean.includes('dilshan')) recipient = 'Dilshan Kumar';
    if (clean.includes('priya')) recipient = 'Priya Verma';
    if (clean.includes('grocery') || clean.includes('kirana')) recipient = 'City Grocery & Kirana';
    if (clean.includes('unknown') || clean.includes('lottery') || clean.includes('hacker')) recipient = 'Unknown Lottery Agent';

    const p = frequentPeople.find(person => person.name.toLowerCase().includes(recipient.toLowerCase())) || frequentPeople[0];
    
    const isBaselineExceeded = amount > (p.baseline * 2);
    const isUnknown = p.baseline === 0;

    const riskTier = isUnknown ? 'CRITICAL' : isBaselineExceeded ? 'HIGH' : 'LOW';
    const reason = isUnknown 
      ? `Unknown recipient with zero past transaction history. Fraud safeguard active.`
      : isBaselineExceeded 
      ? `Amount ₹${amount.toLocaleString('en-IN')} is significantly higher than your typical ₹${p.baseline.toLocaleString('en-IN')} payment to ${p.name}.`
      : `Within typical spending baseline.`;

    const newAlert: TransferAlert = {
      id: `TXN-${Date.now().toString().slice(-6)}`,
      senderName: userName,
      senderPhone: seniorPhoneNumber,
      recipientName: p.name,
      upiId: p.upiId,
      amount: amount,
      baselineAmount: p.baseline,
      riskTier: riskTier,
      riskReason: reason,
      timestamp: 'Just Now',
      advisoryStatus: riskTier === 'LOW' ? 'LOOKS_EXPECTED' : 'PENDING',
      finalStatus: riskTier === 'LOW' ? 'AWAITING_USER_CONFIRMATION' : 'PENDING_ADVISORY'
    };

    setActiveTransfer(newAlert);

    if (riskTier === 'LOW') {
      speakVoice(`Transfer of ₹${amount} to ${p.name} is within your normal baseline. Please review and enter your PIN to confirm.`);
    } else {
      speakVoice(`Notice: ₹${amount} to ${p.name} is higher than your usual ₹${p.baseline}. A private advisory alert has been sent to your guardian ${guardianName} for second opinion.`);
    }
  };

  const handleGuardianAdvisory = (opinion: 'LOOKS_EXPECTED' | 'DONT_RECOGNIZE' | 'REQUEST_VERIFY', note: string) => {
    if (!activeTransfer) return;
    const updated: TransferAlert = {
      ...activeTransfer,
      advisoryStatus: opinion,
      guardianNote: note,
      finalStatus: 'AWAITING_USER_CONFIRMATION'
    };
    setActiveTransfer(updated);

    if (opinion === 'LOOKS_EXPECTED') {
      speakVoice(`${guardianName} confirmed: Looks Expected. Advisory badge updated for ${userName}.`);
    } else if (opinion === 'DONT_RECOGNIZE') {
      speakVoice(`${guardianName} warned: I do not recognize this recipient. Please verify carefully.`);
    } else {
      speakVoice(`${guardianName} requested a quick phone verification call.`);
    }

    setTimeout(() => {
      setActivePersona('user');
    }, 1800);
  };

  const handleTriggerTwilioCall = async () => {
    if (!activeTransfer) return;
    setIsCallingSenior(true);
    setCallStatusMessage(`📞 Calling ${userName} on ${seniorPhoneNumber} via Twilio AI Shield in ${callLanguage.toUpperCase()}...`);

    try {
      const res = await fetch('http://localhost:8000/api/v1/cases/voice/trusted-circle-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senior_phone: seniorPhoneNumber,
          senior_name: userName,
          guardian_name: guardianName,
          recipient_name: activeTransfer.recipientName,
          amount: activeTransfer.amount,
          language: callLanguage,
          transfer_id: activeTransfer.id
        })
      });

      const data = await res.json();
      if (data && data.success) {
        setCallStatusMessage(`🟢 Twilio Call Connected! Call SID: ${data.call_sid}. Speaking initial verification prompt to ${userName}...`);
        fetchLiveCallConversation(activeTransfer.id);
        
        if (callPollingInterval) clearInterval(callPollingInterval);
        const interval = setInterval(() => {
          fetchLiveCallConversation(activeTransfer.id);
        }, 2500);
        setCallPollingInterval(interval);
      } else {
        setCallStatusMessage(`⚠️ Call Notice: ${data.error || 'Check Twilio credentials or ngrok tunnel.'}`);
        setCallConversationTurns([
          {
            id: 'TC-LOCAL-1',
            event_type: 'TRUSTED_CIRCLE_CALL_INITIATED',
            actor: `Guardian (${guardianName})`,
            action: `Initiated Twilio Call to ${userName} (${seniorPhoneNumber})`,
            decision: 'CALLING',
            notes: `🤖 AI Voice Shield (Twilio): "Hello ${userName}! Your guardian ${guardianName} requested verification for ₹${activeTransfer.amount} to ${activeTransfer.recipientName}. Say 'Yes' to confirm or 'No' to cancel."`
          }
        ]);
      }
    } catch (e: any) {
      setCallStatusMessage(`⚠️ Twilio Call Dispatched (Simulated Stream Active).`);
      setCallConversationTurns([
        {
          id: 'TC-LOCAL-1',
          event_type: 'TRUSTED_CIRCLE_CALL_INITIATED',
          actor: `Guardian (${guardianName})`,
          action: `Initiated Twilio Call to ${userName} (${seniorPhoneNumber})`,
          decision: 'CALLING',
          notes: `🤖 AI Voice Shield (Twilio): "Hello ${userName}! Your guardian ${guardianName} requested verification for ₹${activeTransfer.amount} to ${activeTransfer.recipientName}. Say 'Yes' to confirm or 'No' to cancel."`
        }
      ]);
    }
  };

  const handleSimulateSeniorResponse = async (responseType: 'CONFIRM' | 'REJECT') => {
    if (!activeTransfer) return;
    const isConfirm = responseType === 'CONFIRM';
    const speechResult = isConfirm ? 'Yes, I am sending this money' : 'No, cancel this transaction immediately';

    try {
      const url = `http://localhost:8000/api/v1/cases/voice/webhook/trusted-circle-respond?transfer_id=${activeTransfer.id}&senior_name=${encodeURIComponent(userName)}&guardian_name=${encodeURIComponent(guardianName)}&recipient_name=${encodeURIComponent(activeTransfer.recipientName)}&amount=${activeTransfer.amount}&lang=${callLanguage}&SpeechResult=${encodeURIComponent(speechResult)}`;
      await fetch(url, { method: 'POST' });
      await fetchLiveCallConversation(activeTransfer.id);
    } catch (e) {
      const newTurns: CallTurn[] = [
        ...callConversationTurns,
        {
          id: `TC-TURN-${Date.now()}`,
          event_type: isConfirm ? 'TRUSTED_CIRCLE_CONFIRMED' : 'TRUSTED_CIRCLE_CANCELLED',
          actor: `Senior (${userName})`,
          action: isConfirm ? `Confirmed ₹${activeTransfer.amount} Over Phone` : `Rejected ₹${activeTransfer.amount} Over Phone`,
          decision: isConfirm ? 'CONFIRMED' : 'REJECTED',
          notes: `👵 ${userName}: "${speechResult}"\n🤖 AI Voice Shield: "${isConfirm ? `Thank you ${userName}! Transfer verified. ${guardianName} notified.` : `Understood ${userName}! Transfer cancelled immediately.`}"`
        }
      ];
      setCallConversationTurns(newTurns);
      if (isConfirm) {
        setActiveTransfer(prev => prev ? {
          ...prev,
          advisoryStatus: 'LOOKS_EXPECTED',
          verifiedOverPhone: true,
          guardianNote: `Phone verification complete: ${userName} confirmed authorization over Twilio call.`
        } : null);
        setCallStatusMessage(`✓ ${userName} confirmed the transfer over Twilio phone call!`);
      } else {
        setActiveTransfer(prev => prev ? {
          ...prev,
          advisoryStatus: 'DONT_RECOGNIZE',
          guardianNote: `Phone verification alert: ${userName} rejected transfer over phone call.`
        } : null);
        setCallStatusMessage(`⚠️ ${userName} cancelled this transfer during the phone call!`);
      }
    }
  };

  const handleHelperAttemptAuthorization = () => {
    setServerErrorAlert(`HTTP 403 Forbidden: "Shared guidance, not shared access." Trusted Circle guardians (${guardianName}) cannot execute or confirm payments. Only ${userName} holds authorization authority.`);
    speakVoice(`Security Protection: Only ${userName} can authorize this payment. Guardians cannot access funds or enter PIN.`);
  };

  const handleUserConfirmPayment = () => {
    if (pinInput !== '1234') {
      setPinError('Invalid UPI PIN. Enter demo PIN 1234.');
      return;
    }

    if (!activeTransfer) return;

    const newBal = userBalance - activeTransfer.amount;
    setUserBalance(newBal);

    const completedTxn = {
      id: activeTransfer.id,
      recipient: activeTransfer.recipientName,
      upi: activeTransfer.upiId,
      amount: activeTransfer.amount,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'SUCCESS',
      advisory: activeTransfer.verifiedOverPhone ? `${guardianName} & Phone Verified ✓` : (activeTransfer.advisoryStatus === 'LOOKS_EXPECTED' ? `${guardianName} Verified ✓` : 'User Authorized')
    };

    setTransactions(prev => [completedTxn, ...prev]);
    setActiveTransfer(null);
    setShowPinModal(false);
    setPinInput('');
    setPinError('');

    setShowReceiptModal(completedTxn);
    speakVoice(`Payment Successful! ₹${completedTxn.amount} sent to ${completedTxn.recipient}. Updated balance is ₹${newBal.toLocaleString('en-IN')}.`);
  };

  const handleCancelPayment = () => {
    if (!activeTransfer) return;
    speakVoice('Transfer cancelled. No money left your account.');
    setActiveTransfer(null);
  };

  const currentTour = TOUR_STEPS[tourStep - 1] || TOUR_STEPS[0];

  return (
    <div 
      className={`min-h-screen transition-all ${
        highContrast ? 'bg-black text-white' : 'bg-[#F8F9FA] text-gray-900'
      }`}
      style={{ fontSize: `${fontScale * 100}%` }}
    >
      {/* 🌟 TOP DEMO STORY & PERSONA CONTROLLER BAR */}
      <div className="bg-[#1A73E8] text-white border-b-2 border-blue-900 sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white text-[#1A73E8] font-black flex items-center justify-center text-sm shadow-xs">
              🏦
            </div>
            <div>
              <span className="font-black text-xs uppercase tracking-wider block leading-none">
                {t('appTitle')} <span className="bg-amber-400 text-blue-950 text-[9px] px-1.5 py-0.5 rounded-xs font-black">{t('familyShield')}</span>
              </span>
              <span className="text-[10px] text-blue-100 font-medium">{t('tagline')}</span>
            </div>
          </div>

          {/* Persona Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-blue-900/90 p-1 rounded-md border border-blue-600">
            <button
              onClick={() => setActivePersona('user')}
              className={`px-3 py-1.5 rounded-sm text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                activePersona === 'user'
                  ? 'bg-white text-blue-950 shadow-sm'
                  : 'text-blue-100 hover:bg-blue-800'
              }`}
            >
              <span>👵 1. {userName.split(' ')[0]}</span>
              <span className="text-[9px] bg-amber-400 text-blue-950 px-1 rounded-xs font-black">{t('userTag')}</span>
            </button>

            <button
              onClick={() => setActivePersona('guardian')}
              className={`px-3 py-1.5 rounded-sm text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer relative ${
                activePersona === 'guardian'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-purple-200 hover:bg-blue-800'
              }`}
            >
              <span>🛡️ 2. {guardianName}</span>
              {activeTransfer && activeTransfer.advisoryStatus === 'PENDING' && (
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping absolute -top-0.5 -right-0.5" />
              )}
            </button>
          </div>

          {/* Guided Story Tour Bar & Edit Names Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => executeTourStep(1)}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs uppercase rounded-sm flex items-center gap-1 shadow-sm cursor-pointer transition-transform active:scale-95"
            >
              <Play size={13} className="fill-blue-950" />
              <span>{t('runStory')}</span>
            </button>

            <button
              onClick={() => setShowEditNamesModal(true)}
              className="p-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-sm text-xs border border-blue-600 cursor-pointer"
              title={t('editNames')}
            >
              <Edit3 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 🧭 INTERACTIVE 5-STEP GUIDED TOUR HUD (WHAT'S NEXT GUIDE) */}
      {isTourActive && (
        <div className="bg-gradient-to-r from-blue-950 via-indigo-900 to-purple-950 text-white border-b-4 border-amber-400 shadow-xl px-4 py-3">
          <div className="max-w-4xl mx-auto space-y-2.5">
            {/* Step badges */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {TOUR_STEPS.map((s) => (
                  <button
                    key={s.step}
                    onClick={() => executeTourStep(s.step)}
                    className={`px-2.5 py-1 rounded-md text-xs font-black transition-all cursor-pointer ${
                      tourStep === s.step
                        ? 'bg-amber-400 text-blue-950 shadow-md ring-2 ring-white scale-105'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    Step {s.step}
                  </button>
                ))}
              </div>

              {/* Tour Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAutoPlay}
                  className={`px-2.5 py-1 rounded text-xs font-black flex items-center gap-1 cursor-pointer ${
                    isAutoPlaying ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-800 hover:bg-blue-700 text-white'
                  }`}
                >
                  <PlayCircle size={13} />
                  <span>{isAutoPlaying ? 'Auto-Playing...' : 'Auto-Play Tour ⚡'}</span>
                </button>

                <button
                  onClick={handlePrevStep}
                  className="p-1 bg-white/10 hover:bg-white/20 rounded cursor-pointer text-xs"
                  title="Previous Step"
                >
                  <Rewind size={14} />
                </button>

                <button
                  onClick={handleNextStep}
                  className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black rounded text-xs flex items-center gap-1 cursor-pointer shadow-sm"
                >
                  <span>Next Step</span>
                  <FastForward size={14} />
                </button>
              </div>
            </div>

            {/* Current Step Instruction Box */}
            <div className="bg-white/10 p-3 rounded-xl border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-amber-300 uppercase tracking-wider text-[11px]">
                    Step {tourStep} of 5: {currentTour.title}
                  </span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    {activePersona === 'user' ? '👵 Primary User View' : '🛡️ Guardian View'}
                  </span>
                </div>
                <p className="font-semibold text-white/95 text-xs mt-0.5">
                  {currentTour.subtitle}
                </p>
                <p className="text-[11px] text-amber-200/90 font-medium italic mt-0.5">
                  {currentTour.actionPrompt}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => speakVoice(currentTour.narrative)}
                  className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                  title="🔊 Read Tour Step"
                >
                  <Volume2 size={13} />
                  <span>Narrate Step</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ♿ WCAG AAA ACCESSIBILITY CONTROLS BAR */}
      <div className={`border-b py-2 px-4 ${highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Senior Font Scaler */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[11px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <ZoomIn size={14} /> {t('fontSize')}
            </span>
            <button
              onClick={() => setFontScale(prev => Math.max(0.85, prev - 0.15))}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 font-black rounded-xs border border-gray-300 text-xs cursor-pointer"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="font-bold font-mono px-1">{Math.round(fontScale * 100)}%</span>
            <button
              onClick={() => setFontScale(prev => Math.min(1.8, prev + 0.15))}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 font-black rounded-xs border border-gray-300 text-xs cursor-pointer"
              title="Increase Font Size (Senior Mode)"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`px-2.5 py-1 rounded-sm border font-bold flex items-center gap-1 text-[11px] cursor-pointer ${
                highContrast ? 'bg-yellow-400 text-black border-yellow-300 font-black' : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}
            >
              <Contrast size={13} />
              <span>{highContrast ? t('contrastOn') : t('contrastOff')}</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1">
              <Globe size={13} className="text-gray-400" />
              <select
                value={selectedLanguage}
                onChange={(e: any) => {
                  const newLang = e.target.value;
                  setSelectedLanguage(newLang);
                  setCallLanguage(newLang);
                }}
                className="p-1 border border-gray-300 rounded-sm text-[11px] font-bold bg-white cursor-pointer"
              >
                <option value="en">English (India)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 🔊 SYNCHRONIZED CAPTION BANNER */}
      {syncCaption && (
        <div className="bg-amber-300 text-blue-950 font-black px-4 py-2 text-xs border-b-2 border-amber-400 shadow-inner flex items-center justify-between">
          <div className="max-w-4xl mx-auto flex items-center gap-2 w-full">
            <Volume2 size={16} className="text-blue-950 shrink-0" />
            <span className="font-sans italic">{syncCaption}</span>
          </div>
          <button onClick={() => setSyncCaption('')} className="text-blue-950 font-black text-xs hover:opacity-75 cursor-pointer">✕</button>
        </div>
      )}

      {/* HTTP 403 / SERVER-SIDE ENFORCEMENT ALERT */}
      {serverErrorAlert && (
        <div className="bg-red-600 text-white font-bold p-3 text-xs border-b-2 border-red-800 flex items-center justify-between shadow-md">
          <div className="max-w-4xl mx-auto flex items-center gap-2 w-full">
            <AlertTriangle size={18} className="text-yellow-300 shrink-0" />
            <span>{serverErrorAlert}</span>
          </div>
          <button onClick={() => setServerErrorAlert('')} className="text-white font-black text-sm cursor-pointer">✕</button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 👵 VIEW 1: PRIMARY USER (SUNITA VERMA) — GPAY INTERFACE       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activePersona === 'user' && (
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* User Profile Header Card */}
          <div className={`p-6 rounded-2xl border-2 shadow-sm relative overflow-hidden ${
            highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full bg-amber-100 text-2xl flex items-center justify-center border-2 border-amber-300">
                  👵
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-lg text-gray-900 leading-tight">{userName}</h2>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full border border-emerald-300">
                      {t('shieldActive')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono font-medium">UPI: {userName.toLowerCase().replace(/\s+/g, '.')}@sbi</span>
                  <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                    {t('guardianLabel')} <span className="text-purple-700 font-black">{guardianName} ({guardianRelation})</span>
                  </p>
                </div>
              </div>

              {/* Balance Box with Speaker Button */}
              <div className={`p-3.5 rounded-xl border text-right flex flex-col items-end ${
                highContrast ? 'bg-gray-800 border-gray-600' : 'bg-blue-50/70 border-blue-200'
              }`}>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold">
                  <span>{t('savingsBalance')}</span>
                  <button 
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-500 hover:text-gray-800 cursor-pointer"
                    title={showBalance ? "Hide Balance" : "Show Balance"}
                  >
                    {showBalance ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button
                    onClick={() => speakVoice(`Your account balance is ₹${userBalance.toLocaleString('en-IN')}`)}
                    className="p-1 bg-blue-100 text-blue-900 rounded-full hover:bg-blue-200 cursor-pointer"
                    title={t('readBalance')}
                  >
                    <Volume2 size={13} />
                  </button>
                </div>
                <div className="text-2xl font-black text-blue-950 font-mono mt-0.5">
                  {showBalance ? `₹${userBalance.toLocaleString('en-IN')}` : '••••••'}
                </div>
              </div>
            </div>
          </div>

          {/* GOOGLE PAY INDIA FORMAT: FULL-WIDTH PILL VOICE SEARCH BAR */}
          <div className={`p-4 rounded-2xl border-2 shadow-md flex items-center gap-3 ${
            highContrast ? 'bg-gray-900 border-gray-600' : 'bg-white border-gray-300'
          }`}>
            <div className="text-gray-400 pl-1">
              <Globe size={20} className="text-[#1A73E8]" />
            </div>

            <input
              type="text"
              value={voiceTranscript}
              onChange={(e) => setVoiceTranscript(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVoiceCommand(voiceTranscript)}
              placeholder={t('speakPlaceholder', { recipient: demoRecipientName })}
              className="flex-1 text-sm font-bold bg-transparent focus:outline-hidden text-gray-900"
            />

            {/* Oversized 56px Voice Mic Button */}
            <button
              onClick={toggleMic}
              className={`w-14 h-14 rounded-full flex items-center justify-center font-black transition-all shadow-md cursor-pointer ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                  : 'bg-[#1A73E8] hover:bg-blue-700 text-white'
              }`}
              title="Tap to speak"
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
          </div>

          {/* GOOGLE PAY INDIA 4-COLUMN QUICK ACTION CIRCLES */}
          <div className="grid grid-cols-4 gap-3 text-center">
            {[
              { icon: QrCode, label: t('scanQr'), color: 'bg-blue-100 text-blue-900' },
              { icon: Smartphone, label: t('payContacts'), color: 'bg-emerald-100 text-emerald-900' },
              { icon: Landmark, label: t('bankTransfer'), color: 'bg-purple-100 text-purple-900' },
              { icon: HeartHandshake, label: t('trustedCircle'), color: 'bg-amber-100 text-amber-900' },
            ].map((action, idx) => {
              const IconComp = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (idx === 3) {
                      setActivePersona('guardian');
                    } else {
                      handleVoiceCommand(`Send 5000 to ${demoRecipientName}`);
                    }
                  }}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 shadow-xs hover:scale-105 transition-transform cursor-pointer ${
                    highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color}`}>
                    <IconComp size={22} />
                  </div>
                  <span className="text-xs font-black uppercase text-gray-800">{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE TRANSACTION REVIEW & TRUSTED CIRCLE ADVISORY CARD */}
          {activeTransfer && (
            <div className={`p-6 rounded-2xl border-4 shadow-xl relative ${
              activeTransfer.advisoryStatus === 'DONT_RECOGNIZE'
                ? 'border-red-500 bg-red-50/50'
                : activeTransfer.advisoryStatus === 'LOOKS_EXPECTED'
                ? 'border-emerald-500 bg-emerald-50/50 ring-4 ring-emerald-300'
                : 'border-amber-400 bg-amber-50/40'
            }`}>
              <div className="flex items-start justify-between gap-3 border-b pb-3 mb-4 border-gray-300">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-950 text-white px-2 py-0.5 rounded-xs">
                    {t('pendingReview')}
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-1">
                    {t('paying')} ₹{activeTransfer.amount.toLocaleString('en-IN')} to {activeTransfer.recipientName}
                  </h3>
                  <span className="text-xs font-mono text-gray-500">{activeTransfer.upiId}</span>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase ${
                    activeTransfer.riskTier === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeTransfer.riskTier} {t('riskAnomaly')}
                  </span>
                </div>
              </div>

              {/* Behavioral Risk Reason */}
              <div className="p-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 mb-4 flex items-start gap-2">
                <Info size={16} className="text-blue-700 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-gray-900 font-black">{t('protectionCheck')}</strong>
                  {activeTransfer.riskReason}
                </div>
              </div>

              {/* 🛡️ TRUSTED CIRCLE ADVISORY STATUS BADGE */}
              <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HeartHandshake size={18} className="text-purple-700" />
                    <span className="text-xs font-black uppercase text-purple-950">
                      {t('trustedAdvisory')} ({guardianName})
                    </span>
                  </div>
                  <button
                    onClick={() => setActivePersona('guardian')}
                    className="text-[11px] font-black text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t('viewAs')} {guardianName}</span>
                    <ChevronRight size={12} />
                  </button>
                </div>

                {activeTransfer.advisoryStatus === 'PENDING' ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100/70 p-2.5 rounded-lg border border-amber-300">
                    <Clock size={16} className="animate-spin text-amber-700 shrink-0" />
                    <span>{t('awaitingOpinion', { guardian: guardianName })}</span>
                  </div>
                ) : activeTransfer.advisoryStatus === 'LOOKS_EXPECTED' ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 p-2.5 rounded-lg border border-emerald-300">
                    <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                    <div>
                      <span className="font-black block">{t('looksExpectedTitle', { guardian: guardianName })}</span>
                      <span className="text-[11px] font-normal text-emerald-900">{activeTransfer.guardianNote || 'Verified as recognized payment.'}</span>
                      {activeTransfer.verifiedOverPhone && (
                        <span className="inline-block mt-1 text-[10px] bg-emerald-700 text-white font-black px-2 py-0.5 rounded-xs">
                          {t('verifiedOverPhoneBadge')}
                        </span>
                      )}
                    </div>
                  </div>
                ) : activeTransfer.advisoryStatus === 'DONT_RECOGNIZE' ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-red-800 bg-red-100 p-2.5 rounded-lg border border-red-300">
                    <AlertTriangle size={18} className="text-red-700 shrink-0" />
                    <div>
                      <span className="font-black block">{t('dontRecognizeTitle', { guardian: guardianName })}</span>
                      <span className="text-[11px] font-normal text-red-900">{activeTransfer.guardianNote || 'Please verify before entering your PIN.'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-100 p-2.5 rounded-lg border border-blue-300">
                    <HelpCircle size={18} className="text-blue-700 shrink-0" />
                    <span>{t('requestVerifyTitle', { guardian: guardianName })}</span>
                  </div>
                )}
              </div>

              {/* USER-ONLY AUTHORIZATION BUTTONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setShowPinModal(true)}
                  className="py-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-sm uppercase rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <KeyRound size={18} />
                  <span>{t('confirmPayment')}</span>
                </button>

                <button
                  onClick={handleCancelPayment}
                  className="py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-900 font-black text-sm uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <XCircle size={18} />
                  <span>{t('cancelTransfer')}</span>
                </button>
              </div>
            </div>
          )}

          {/* HORIZONTAL SCROLLABLE PEOPLE AVATARS */}
          <div className={`p-5 rounded-2xl border-2 shadow-sm ${
            highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-500 mb-3">
              {t('frequentContacts')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {frequentPeople.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleVoiceCommand(`Send ${p.baseline || 2000} to ${p.name}`)}
                  className="p-3 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center text-center transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-2xl flex items-center justify-center mb-1.5 shadow-xs">
                    {p.avatar}
                  </div>
                  <span className="font-black text-xs text-gray-900 truncate w-full">{p.name}</span>
                  <span className="text-[10px] text-gray-500">{p.lastPaid}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RECENT TRANSACTION HISTORY */}
          <div className={`p-5 rounded-2xl border-2 shadow-sm ${
            highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-500 mb-3">
              {t('recentTransactions')}
            </h3>
            <div className="divide-y divide-gray-200">
              {transactions.map((txn, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <ArrowUpRight size={16} />
                    </div>
                    <div>
                      <h4 className="font-black text-xs text-gray-900">{txn.recipient}</h4>
                      <span className="text-[10px] text-gray-500 font-mono">{txn.date} · {txn.advisory}</span>
                    </div>
                  </div>
                  <span className="font-black text-sm text-gray-900 font-mono">
                    -₹{txn.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 🛡️ VIEW 2: GUARDIAN (DILSHAN / DAUGHTER) — TRUSTED ADVISORY   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activePersona === 'guardian' && (
        <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Guardian Profile Header */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-2xl shadow-lg border-2 border-purple-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-full bg-purple-200 text-purple-950 text-2xl flex items-center justify-center font-black">
                  👨🏻‍💼
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-lg">{guardianName} ({guardianRelation})</h2>
                    <span className="text-[10px] bg-purple-300 text-purple-950 font-black px-2 py-0.5 rounded-full">
                      {t('trustedGuardianTitle')}
                    </span>
                  </div>
                  <span className="text-xs text-purple-200 font-mono">{t('protecting')} {userName}</span>
                  <p className="text-[11px] text-purple-100 font-medium mt-1">
                    {t('advisoryModeDesc')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActivePersona('user')}
                className="px-3.5 py-2 bg-white text-purple-950 font-black text-xs uppercase rounded-xl hover:bg-purple-50 shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <span>{t('switchToUser', { user: userName.split(' ')[0] })}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* ACTIVE ADVISORY REQUEST */}
          {activeTransfer ? (
            <div className="bg-white border-4 border-purple-600 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600 animate-ping" />
                  <h3 className="font-black text-sm uppercase tracking-wide text-purple-950">
                    {t('incomingRequest', { user: userName })}
                  </h3>
                </div>
                <span className="text-xs font-black bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                  {activeTransfer.riskTier} RISK
                </span>
              </div>

              {/* Transaction Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-purple-50/60 rounded-xl border border-purple-200 text-xs">
                <div>
                  <span className="text-gray-500 font-bold block text-[10px] uppercase">{t('recipientLabel')}</span>
                  <span className="font-black text-sm text-gray-900">{activeTransfer.recipientName}</span>
                  <span className="text-[10px] font-mono text-gray-500 block">{activeTransfer.upiId}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold block text-[10px] uppercase">{t('requestedAmount')}</span>
                  <span className="font-black text-base text-red-600 font-mono">
                    ₹{activeTransfer.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold block text-[10px] uppercase">{t('spendingBaseline')}</span>
                  <span className="font-bold text-gray-700">₹{activeTransfer.baselineAmount.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-red-600 font-bold block">(3.3x {t('deviation')})</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900">
                {t('whySeeingThis', { user: userName })}
              </div>

              {/* ───────────────────────────────────────────────────────────── */}
              {/* 📞 TWILIO LIVE PHONE CALL VERIFICATION SECTION                */}
              {/* ───────────────────────────────────────────────────────────── */}
              <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PhoneCall size={20} className="text-blue-700" />
                    <h4 className="font-black text-xs uppercase tracking-wide text-blue-950">
                      {t('twilioCallCardTitle')}
                    </h4>
                  </div>
                  <span className="text-[10px] bg-blue-200 text-blue-900 font-black px-2 py-0.5 rounded-full">
                    Twilio AI Interactive
                  </span>
                </div>

                <p className="text-xs text-blue-900">
                  {t('twilioCallCardDesc')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black uppercase text-gray-600 mb-0.5">{t('seniorPhoneLabel')}</label>
                    <input
                      type="text"
                      value={seniorPhoneNumber}
                      onChange={(e) => setSeniorPhoneNumber(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg font-mono font-bold text-xs"
                      placeholder="+919461284678"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-600 mb-0.5">{t('callLangLabel')}</label>
                    <select
                      value={callLanguage}
                      onChange={(e: any) => setCallLanguage(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-lg font-bold text-xs cursor-pointer"
                    >
                      <option value="en">English (India)</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="kn">ಕನ್ನಡ (Kannada)</option>
                      <option value="mr">मराठी (Marathi)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleTriggerTwilioCall}
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-transform active:scale-95"
                >
                  <PhoneForwarded size={16} />
                  <span>{t('startTwilioCallBtn')}</span>
                </button>

                {callStatusMessage && (
                  <div className="p-2.5 bg-blue-100/80 border border-blue-300 rounded-lg text-xs font-bold text-blue-950 flex items-center gap-2">
                    <Radio size={14} className="text-blue-700 animate-pulse shrink-0" />
                    <span>{callStatusMessage}</span>
                  </div>
                )}

                {/* 🔴 LIVE SHARED CONVERSATION TRANSCRIPT STREAM */}
                <div className="mt-3 bg-white p-4 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between border-b pb-1.5 border-gray-200">
                    <span className="font-black text-[11px] uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <MessageSquare size={14} className="text-purple-600" />
                      {t('liveConversationTitle')}
                    </span>
                    <button
                      onClick={() => fetchLiveCallConversation(activeTransfer.id)}
                      className="text-[10px] text-blue-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={10} /> Refresh
                    </button>
                  </div>

                  {callConversationTurns.length === 0 ? (
                    <div className="text-center py-4 text-xs text-gray-400 font-medium">
                      {t('noTurnsYet')}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {callConversationTurns.map((turn, tIdx) => (
                        <div 
                          key={tIdx} 
                          className={`p-2.5 rounded-lg text-xs border ${
                            turn.decision === 'CONFIRMED'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                              : turn.decision === 'REJECTED'
                              ? 'bg-red-50 border-red-300 text-red-950'
                              : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 mb-1">
                            <span>{turn.actor} · {turn.action}</span>
                            <span className="font-mono">{turn.timestamp ? new Date(turn.timestamp).toLocaleTimeString() : 'Just now'}</span>
                          </div>
                          <div className="whitespace-pre-line font-medium text-xs">
                            {turn.notes}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Interactive Quick Simulation Buttons for Demo */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSimulateSeniorResponse('CONFIRM')}
                      className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-md font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <span>🗣️ {t('simulateSeniorYes')}</span>
                    </button>
                    <button
                      onClick={() => handleSimulateSeniorResponse('REJECT')}
                      className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-900 rounded-md font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <span>🗣️ {t('simulateSeniorNo')}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 ADVISORY FEEDBACK OPTIONS */}
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider text-gray-700 mb-2">
                  {t('selectRecommendation')}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleGuardianAdvisory('LOOKS_EXPECTED', `I recognize ${activeTransfer.recipientName} for legitimate expenses.`)}
                    className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black text-xs rounded-xl flex flex-col items-center text-center gap-1 cursor-pointer transition-all shadow-xs"
                  >
                    <CheckCircle2 size={22} className="text-emerald-600" />
                    <span>{t('optLooksExpected')}</span>
                    <span className="text-[10px] text-emerald-700 font-normal">{t('optLooksExpectedSub')}</span>
                  </button>

                  <button
                    onClick={() => handleGuardianAdvisory('DONT_RECOGNIZE', 'Unknown recipient. Please hold or verify.')}
                    className="p-3.5 bg-red-50 hover:bg-red-100 border-2 border-red-400 text-red-950 font-black text-xs rounded-xl flex flex-col items-center text-center gap-1 cursor-pointer transition-all shadow-xs"
                  >
                    <AlertTriangle size={22} className="text-red-600" />
                    <span>{t('optDontRecognize')}</span>
                    <span className="text-[10px] text-red-700 font-normal">{t('optDontRecognizeSub')}</span>
                  </button>

                  <button
                    onClick={() => handleGuardianAdvisory('REQUEST_VERIFY', 'Call me before proceeding.')}
                    className="p-3.5 bg-blue-50 hover:bg-blue-100 border-2 border-blue-400 text-blue-950 font-black text-xs rounded-xl flex flex-col items-center text-center gap-1 cursor-pointer transition-all shadow-xs"
                  >
                    <HelpCircle size={22} className="text-blue-600" />
                    <span>{t('optRequestVerify')}</span>
                    <span className="text-[10px] text-blue-700 font-normal">{t('optRequestVerifySub')}</span>
                  </button>
                </div>
              </div>

              {/* DEMO: HELPER ATTEMPTING AUTHORIZATION (HTTP 403 ENFORCEMENT) */}
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={handleHelperAttemptAuthorization}
                  className="text-xs text-gray-500 hover:text-red-600 font-bold underline flex items-center gap-1 cursor-pointer"
                  title="Test security: helper cannot confirm payment"
                >
                  <ShieldAlert size={14} />
                  <span>{t('testSecurityBlock', { guardian: guardianName })}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white border-2 border-gray-200 rounded-2xl shadow-sm">
              <ShieldCheck size={40} className="mx-auto text-emerald-500 mb-2" />
              <h3 className="font-black text-sm uppercase text-gray-800">{t('allClear')}</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                {t('allClearSub', { user: userName })}
              </p>
            </div>
          )}
        </main>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* EDIT NAMES CUSTOMIZER MODAL                                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showEditNamesModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-blue-950 w-full max-w-md rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-sm font-black uppercase text-gray-900 flex items-center gap-1.5">
                <Edit3 size={16} className="text-[#1A73E8]" /> {t('editNames')}
              </h3>
              <button onClick={() => setShowEditNamesModal(false)} className="font-bold text-gray-400 hover:text-gray-700 cursor-pointer">✕</button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-black uppercase text-gray-700 mb-1">Primary Senior User Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2.5 border-2 border-gray-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-black uppercase text-gray-700 mb-1">Trusted Guardian / Helper Name</label>
                <input
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full p-2.5 border-2 border-gray-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-black uppercase text-gray-700 mb-1">Guardian Relationship</label>
                <input
                  type="text"
                  value={guardianRelation}
                  onChange={(e) => setGuardianRelation(e.target.value)}
                  className="w-full p-2.5 border-2 border-gray-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block font-black uppercase text-gray-700 mb-1">Demo Transfer Recipient Name</label>
                <input
                  type="text"
                  value={demoRecipientName}
                  onChange={(e) => setDemoRecipientName(e.target.value)}
                  className="w-full p-2.5 border-2 border-gray-300 rounded-lg font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200">
              <button
                onClick={() => setShowEditNamesModal(false)}
                className="px-5 py-2 bg-blue-900 text-white font-black text-xs uppercase rounded-lg shadow-sm cursor-pointer"
              >
                {t('saveNames')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP-UP PIN VERIFICATION MODAL (USER ONLY)                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-blue-950 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-950 rounded-full flex items-center justify-center mx-auto mb-3">
              <KeyRound size={26} />
            </div>

            <h3 className="text-base font-black uppercase text-gray-900">
              {t('authorizePayment', { user: userName })}
            </h3>
            <span className="text-2xl font-black text-blue-950 block my-1 font-mono">
              ₹5,000 to {demoRecipientName}
            </span>

            <p className="text-xs text-gray-500 mb-4 font-medium">
              {t('pinNotice')}
            </p>

            <div className="mb-4">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-widest text-3xl py-2.5 border-2 border-gray-300 rounded-xl font-mono focus:outline-hidden focus:border-blue-700 bg-gray-50 font-bold"
              />
              <span className="text-[10px] text-gray-400 font-bold block mt-1">{t('demoPinLabel')}</span>
              {pinError && <p className="text-xs text-red-600 font-bold mt-1">{pinError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowPinModal(false)}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-xs uppercase rounded-xl cursor-pointer"
              >
                {t('cancelTransfer')}
              </button>
              <button
                onClick={handleUserConfirmPayment}
                className="py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase rounded-xl shadow-md cursor-pointer"
              >
                {t('confirmAndPay')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* DIGITAL RECEIPT MODAL                                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-blue-950 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={32} />
            </div>

            <h3 className="text-lg font-black uppercase text-gray-900">
              {t('paymentSuccessful')}
            </h3>
            <span className="text-3xl font-black text-gray-900 block my-2 font-mono">
              ₹{showReceiptModal.amount.toLocaleString('en-IN')}
            </span>

            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-left text-xs space-y-2 my-4">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">{t('recipientLabel')}:</span>
                <span className="font-black text-gray-900">{showReceiptModal.recipient}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-gray-500 font-bold">UPI ID:</span>
                <span className="text-gray-700">{showReceiptModal.upi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">{t('referenceLabel')}</span>
                <span className="font-mono text-[11px] font-bold text-gray-900">{showReceiptModal.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">{t('trustedCircle')}:</span>
                <span className="text-purple-800 font-bold">{showReceiptModal.advisory}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceiptModal(null)}
              className="w-full py-2.5 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs uppercase rounded-xl cursor-pointer"
            >
              {t('doneBtn')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
