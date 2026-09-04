"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Send, ShieldCheck, AlertTriangle, Clock, CheckCircle2,
  XCircle, User, Users, ArrowUpRight, ArrowDownLeft, RefreshCw,
  Phone, KeyRound, ChevronRight, Settings, Info, Sparkles, Volume2,
  FileText, ShieldAlert, History, Plus, Check, Play, Square, ExternalLink,
  QrCode, Landmark, Smartphone, HeartHandshake, Eye, EyeOff, HelpCircle,
  ZoomIn, ZoomOut, Contrast, Globe, Shield, MessageCircle, AlertCircle, Edit3, X
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
}

interface Person {
  name: string;
  upiId: string;
  avatar: string;
  color: string;
  lastPaid: string;
  baseline: number;
}

export default function BankSathiApp() {
  // Configurable Persona Names
  const [userName, setUserName] = useState('Sunita Verma');
  const [guardianName, setGuardianName] = useState('Dilshan');
  const [guardianRelation, setGuardianRelation] = useState('Son & Trusted Guardian');
  const [demoRecipientName, setDemoRecipientName] = useState('Rohan Sharma');
  const [showEditNamesModal, setShowEditNamesModal] = useState(false);

  // Active Persona: "user" (Sunita) or "guardian" (Dilshan)
  const [activePersona, setActivePersona] = useState<'user' | 'guardian'>('user');

  // Accessibility States (WCAG AAA)
  const [fontScale, setFontScale] = useState(1.0);
  const [highContrast, setHighContrast] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'kn' | 'mr' | 'ta'>('en');
  const [showBalance, setShowBalance] = useState(true);

  // Financial Balances
  const [userBalance, setUserBalance] = useState(50000);
  const [guardianBalance, setGuardianBalance] = useState(142000);

  // Speech & Voice State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [syncCaption, setSyncCaption] = useState('');
  const [speechEnabled, setSpeechEnabled] = useState(true);

  // Frequent People Directory
  const [frequentPeople, setFrequentPeople] = useState<Person[]>([
    { name: 'Rohan Sharma', upiId: 'rohan.sharma@okaxis', avatar: '👨🏽', color: 'bg-emerald-600', lastPaid: '₹1,500 · 2 weeks ago', baseline: 1500 },
    { name: 'Dilshan Kumar', upiId: 'dilshan.k@okhdfcbank', avatar: '👨🏻‍💼', color: 'bg-purple-600', lastPaid: '₹5,000 · 1 month ago', baseline: 5000 },
    { name: 'Priya Verma', upiId: 'priya.verma@okicici', avatar: '👩🏻‍💻', color: 'bg-blue-600', lastPaid: '₹3,200 · 3 weeks ago', baseline: 3000 },
    { name: 'City Grocery & Kirana', upiId: 'grocery@paytm', avatar: '🏪', color: 'bg-amber-600', lastPaid: '₹850 · 3 days ago', baseline: 1000 },
    { name: 'Unknown Lottery Agent', upiId: 'unknown.win99@ybl', avatar: '🕵️', color: 'bg-red-600', lastPaid: 'No history', baseline: 0 },
  ]);

  // Current Transfer in Progress
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

  // Completed Transactions Ledger
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

  // Modals
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState<any>(null);
  const [serverErrorAlert, setServerErrorAlert] = useState('');

  const recognitionRef = useRef<any>(null);

  // Text-To-Speech with Indian Accent / Multi-language support
  const speakVoice = (text: string) => {
    setSyncCaption(text);
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const inVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India') || v.name.includes('Aditi'));
      if (inVoice) utterance.voice = inVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech error:', e);
    }
  };

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        reco.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'kn' ? 'kn-IN' : 'en-IN';

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

  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setIsListening(true);
        setVoiceTranscript('');
        recognitionRef.current.start();
        speakVoice(selectedLanguage === 'hi' ? `नमस्ते ${userName}, किसको कितने पैसे भेजने हैं?` : `Hello ${userName}, who would you like to send money to?`);
      } else {
        alert('Speech recognition is not supported in this browser. Please use the quick action buttons.');
      }
    }
  };

  // Voice Command Intent Extraction & Risk Baseline Check
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
    
    // Compute Risk Tier
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
      senderPhone: '9999999001',
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

  // Run 1-Click Interactive ₹5,000 Demo Story
  const runDemoStory = () => {
    setActivePersona('user');
    const demoAlert: TransferAlert = {
      id: 'TXN-DEMO-5000',
      senderName: userName,
      senderPhone: '9999999001',
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
    speakVoice(`Step 1: ${userName} is sending ₹5,000 to ${demoRecipientName}. The risk engine detected the baseline deviation and sent an advisory alert to ${guardianName}.`);
  };

  // Guardian Submits Advisory Opinion
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

    // Switch back to primary user view
    setTimeout(() => {
      setActivePersona('user');
    }, 1800);
  };

  // Attempt Helper Authorization (Server-Side Block Enforcement Demonstration)
  const handleHelperAttemptAuthorization = () => {
    setServerErrorAlert(`HTTP 403 Forbidden: "Shared guidance, not shared access." Trusted Circle guardians (${guardianName}) cannot execute or confirm payments. Only ${userName} holds authorization authority.`);
    speakVoice(`Security Protection: Only ${userName} can authorize this payment. Guardians cannot access funds or enter PIN.`);
  };

  // Primary User Confirms Final Payment with PIN
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
      advisory: activeTransfer.advisoryStatus === 'LOOKS_EXPECTED' ? `${guardianName} Verified ✓` : 'User Authorized'
    };

    setTransactions(prev => [completedTxn, ...prev]);
    setActiveTransfer(null);
    setShowPinModal(false);
    setPinInput('');
    setPinError('');

    setShowReceiptModal(completedTxn);
    speakVoice(`Payment Successful! ₹${completedTxn.amount} sent to ${completedTxn.recipient}. Updated balance is ₹${newBal.toLocaleString('en-IN')}.`);
  };

  // Cancel Payment
  const handleCancelPayment = () => {
    if (!activeTransfer) return;
    speakVoice('Transfer cancelled. No money left your account.');
    setActiveTransfer(null);
  };

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
                BankSathi <span className="bg-amber-400 text-blue-950 text-[9px] px-1.5 py-0.5 rounded-xs font-black">FAMILY SHIELD</span>
              </span>
              <span className="text-[10px] text-blue-100 font-medium">Shared Guidance, Not Shared Access</span>
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
              <span className="text-[9px] bg-amber-400 text-blue-950 px-1 rounded-xs font-black">USER</span>
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

          {/* 1-Click Demo Story & Edit Names Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={runDemoStory}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs uppercase rounded-sm flex items-center gap-1 shadow-sm cursor-pointer transition-transform active:scale-95"
            >
              <Play size={13} className="fill-blue-950" />
              <span>▶️ Run ₹5,000 Story</span>
            </button>

            <button
              onClick={() => setShowEditNamesModal(true)}
              className="p-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-sm text-xs border border-blue-600 cursor-pointer"
              title="Customize Names"
            >
              <Edit3 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ♿ WCAG AAA ACCESSIBILITY CONTROLS BAR */}
      <div className={`border-b py-2 px-4 ${highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Senior Font Scaler */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[11px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <ZoomIn size={14} /> Font Size:
            </span>
            <button
              onClick={() => setFontScale(prev => Math.max(0.85, prev - 0.15))}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 font-black rounded-xs border border-gray-300 text-xs"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="font-bold font-mono px-1">{Math.round(fontScale * 100)}%</span>
            <button
              onClick={() => setFontScale(prev => Math.min(1.8, prev + 0.15))}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 font-black rounded-xs border border-gray-300 text-xs"
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
              <span>{highContrast ? 'High Contrast ON' : 'Standard Contrast'}</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1">
              <Globe size={13} className="text-gray-400" />
              <select
                value={selectedLanguage}
                onChange={(e: any) => setSelectedLanguage(e.target.value)}
                className="p-1 border border-gray-300 rounded-sm text-[11px] font-bold bg-white"
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
          <button onClick={() => setSyncCaption('')} className="text-blue-950 font-black text-xs hover:opacity-75">✕</button>
        </div>
      )}

      {/* HTTP 403 / SERVER-SIDE ENFORCEMENT ALERT */}
      {serverErrorAlert && (
        <div className="bg-red-600 text-white font-bold p-3 text-xs border-b-2 border-red-800 flex items-center justify-between shadow-md">
          <div className="max-w-4xl mx-auto flex items-center gap-2 w-full">
            <AlertTriangle size={18} className="text-yellow-300 shrink-0" />
            <span>{serverErrorAlert}</span>
          </div>
          <button onClick={() => setServerErrorAlert('')} className="text-white font-black text-sm">✕</button>
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
                      Family Shield Active
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono font-medium">UPI: {userName.toLowerCase().replace(/\s+/g, '.')}@sbi</span>
                  <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                    Guardian: <span className="text-purple-700 font-black">{guardianName} ({guardianRelation})</span>
                  </p>
                </div>
              </div>

              {/* Balance Box with Speaker Button */}
              <div className={`p-3.5 rounded-xl border text-right flex flex-col items-end ${
                highContrast ? 'bg-gray-800 border-gray-600' : 'bg-blue-50/70 border-blue-200'
              }`}>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold">
                  <span>Savings Balance</span>
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
                    title="🔊 Read Balance Out Loud"
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
              placeholder={`Speak or type: 'Send 5000 to ${demoRecipientName}'...`}
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
              { icon: QrCode, label: 'Scan QR', color: 'bg-blue-100 text-blue-900' },
              { icon: Smartphone, label: 'Pay Contacts', color: 'bg-emerald-100 text-emerald-900' },
              { icon: Landmark, label: 'Bank Transfer', color: 'bg-purple-100 text-purple-900' },
              { icon: HeartHandshake, label: 'Trusted Circle', color: 'bg-amber-100 text-amber-900' },
            ].map((action, idx) => {
              const IconComp = action.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (action.label === 'Trusted Circle') {
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
                ? 'border-emerald-500 bg-emerald-50/50'
                : 'border-amber-400 bg-amber-50/40'
            }`}>
              <div className="flex items-start justify-between gap-3 border-b pb-3 mb-4 border-gray-300">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-950 text-white px-2 py-0.5 rounded-xs">
                    Pending Transfer Review
                  </span>
                  <h3 className="text-xl font-black text-gray-900 mt-1">
                    Paying ₹{activeTransfer.amount.toLocaleString('en-IN')} to {activeTransfer.recipientName}
                  </h3>
                  <span className="text-xs font-mono text-gray-500">{activeTransfer.upiId}</span>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full uppercase ${
                    activeTransfer.riskTier === 'HIGH' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {activeTransfer.riskTier} Risk Anomaly
                  </span>
                </div>
              </div>

              {/* Behavioral Risk Reason */}
              <div className="p-3 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 mb-4 flex items-start gap-2">
                <Info size={16} className="text-blue-700 mt-0.5 shrink-0" />
                <div>
                  <strong className="block text-gray-900 font-black">Behavioral Protection Check:</strong>
                  {activeTransfer.riskReason}
                </div>
              </div>

              {/* 🛡️ TRUSTED CIRCLE ADVISORY STATUS BADGE */}
              <div className="p-4 bg-purple-50 border-2 border-purple-300 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HeartHandshake size={18} className="text-purple-700" />
                    <span className="text-xs font-black uppercase text-purple-950">
                      Trusted Circle Advisory ({guardianName})
                    </span>
                  </div>
                  <button
                    onClick={() => setActivePersona('guardian')}
                    className="text-[11px] font-black text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View as {guardianName}</span>
                    <ChevronRight size={12} />
                  </button>
                </div>

                {activeTransfer.advisoryStatus === 'PENDING' ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100/70 p-2.5 rounded-lg border border-amber-300">
                    <Clock size={16} className="animate-spin text-amber-700" />
                    <span>Advisory ping sent to {guardianName}. Awaiting second opinion...</span>
                  </div>
                ) : activeTransfer.advisoryStatus === 'LOOKS_EXPECTED' ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 p-2.5 rounded-lg border border-emerald-300">
                    <CheckCircle2 size={18} className="text-emerald-700" />
                    <div>
                      <span className="font-black block">✓ {guardianName}: &quot;Looks Expected&quot;</span>
                      <span className="text-[11px] font-normal text-emerald-900">{activeTransfer.guardianNote || 'Verified as recognized payment.'}</span>
                    </div>
                  </div>
                ) : activeTransfer.advisoryStatus === 'DONT_RECOGNIZE' ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-red-800 bg-red-100 p-2.5 rounded-lg border border-red-300">
                    <AlertTriangle size={18} className="text-red-700" />
                    <div>
                      <span className="font-black block">⚠️ {guardianName}: &quot;I Don&apos;t Recognize This&quot;</span>
                      <span className="text-[11px] font-normal text-red-900">{activeTransfer.guardianNote || 'Please verify before entering your PIN.'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-800 bg-blue-100 p-2.5 rounded-lg border border-blue-300">
                    <HelpCircle size={18} className="text-blue-700" />
                    <span>{guardianName} requested voice/phone verification before approving.</span>
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
                  <span>Confirm Payment (Enter PIN)</span>
                </button>

                <button
                  onClick={handleCancelPayment}
                  className="py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-900 font-black text-sm uppercase rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <XCircle size={18} />
                  <span>Cancel Transfer</span>
                </button>
              </div>
            </div>
          )}

          {/* HORIZONTAL SCROLLABLE PEOPLE AVATARS */}
          <div className={`p-5 rounded-2xl border-2 shadow-sm ${
            highContrast ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-500 mb-3">
              Frequent Contacts (1-Tap Pay)
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
              Recent Transactions
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
      {/* 🛡️ VIEW 2: GUARDIAN (DILSHAN) — TRUSTED ADVISORY DASHBOARD     */}
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
                      Trusted Guardian
                    </span>
                  </div>
                  <span className="text-xs text-purple-200 font-mono">Protecting {userName}</span>
                  <p className="text-[11px] text-purple-100 font-medium mt-1">
                    🛡️ Advisory Guidance Mode: You provide real-time recommendations with zero screen-sharing or PIN access.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActivePersona('user')}
                className="px-3.5 py-2 bg-white text-purple-950 font-black text-xs uppercase rounded-xl hover:bg-purple-50 shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <span>Switch to {userName.split(' ')[0]} View</span>
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
                    Incoming Advisory Request from {userName}
                  </h3>
                </div>
                <span className="text-xs font-black bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                  {activeTransfer.riskTier} RISK
                </span>
              </div>

              {/* Transaction Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-purple-50/60 rounded-xl border border-purple-200 text-xs">
                <div>
                  <span className="text-gray-500 font-bold block text-[10px] uppercase">Recipient</span>
                  <span className="font-black text-sm text-gray-900">{activeTransfer.recipientName}</span>
                  <span className="text-[10px] font-mono text-gray-500 block">{activeTransfer.upiId}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold block text-[10px] uppercase">Requested Amount</span>
                  <span className="font-black text-base text-red-600 font-mono">
                    ₹{activeTransfer.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold block text-[10px] uppercase">Spending Baseline</span>
                  <span className="font-bold text-gray-700">₹{activeTransfer.baselineAmount.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-red-600 font-bold block">(3.3x deviation)</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900">
                <strong>Why You&apos;re Seeing This:</strong> {userName} rarely transfers more than ₹1,500. This ₹5,000 transfer triggered the BankSathi Trusted Circle protocol to ask for your advisory second opinion.
              </div>

              {/* 3 ADVISORY FEEDBACK OPTIONS */}
              <div>
                <h4 className="font-black text-xs uppercase tracking-wider text-gray-700 mb-2">
                  Select Your Advisory Recommendation:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleGuardianAdvisory('LOOKS_EXPECTED', `I recognize ${activeTransfer.recipientName} for legitimate expenses.`)}
                    className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-400 text-emerald-950 font-black text-xs rounded-xl flex flex-col items-center text-center gap-1 cursor-pointer transition-all shadow-xs"
                  >
                    <CheckCircle2 size={22} className="text-emerald-600" />
                    <span>✓ Looks Expected</span>
                    <span className="text-[10px] text-emerald-700 font-normal">I recognize this recipient and amount.</span>
                  </button>

                  <button
                    onClick={() => handleGuardianAdvisory('DONT_RECOGNIZE', 'Unknown recipient. Please hold or verify.')}
                    className="p-3.5 bg-red-50 hover:bg-red-100 border-2 border-red-400 text-red-950 font-black text-xs rounded-xl flex flex-col items-center text-center gap-1 cursor-pointer transition-all shadow-xs"
                  >
                    <AlertTriangle size={22} className="text-red-600" />
                    <span>⚠️ Don&apos;t Recognize This</span>
                    <span className="text-[10px] text-red-700 font-normal">Warn user of potential scam.</span>
                  </button>

                  <button
                    onClick={() => handleGuardianAdvisory('REQUEST_VERIFY', 'Call me before proceeding.')}
                    className="p-3.5 bg-blue-50 hover:bg-blue-100 border-2 border-blue-400 text-blue-950 font-black text-xs rounded-xl flex flex-col items-center text-center gap-1 cursor-pointer transition-all shadow-xs"
                  >
                    <HelpCircle size={22} className="text-blue-600" />
                    <span>❓ Request Verification</span>
                    <span className="text-[10px] text-blue-700 font-normal">Ask user to call before paying.</span>
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
                  <span>Test Security: Attempt to confirm payment as {guardianName} (Simulate HTTP 403)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white border-2 border-gray-200 rounded-2xl shadow-sm">
              <ShieldCheck size={40} className="mx-auto text-emerald-500 mb-2" />
              <h3 className="font-black text-sm uppercase text-gray-800">All Clear — No Pending Alerts</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                {userName} has no active anomalous transfers. Click <strong>&quot;▶️ Run ₹5,000 Story&quot;</strong> above to simulate a new transfer alert.
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
                <Edit3 size={16} className="text-[#1A73E8]" /> Customize Persona Names
              </h3>
              <button onClick={() => setShowEditNamesModal(false)} className="font-bold text-gray-400 hover:text-gray-700">✕</button>
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
                className="px-5 py-2 bg-blue-900 text-white font-black text-xs uppercase rounded-lg shadow-sm"
              >
                Save &amp; Apply Names
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STEP-UP PIN VERIFICATION MODAL (USER ONLY)                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showPinModal && activeTransfer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-blue-950 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-950 rounded-full flex items-center justify-center mx-auto mb-3">
              <KeyRound size={26} />
            </div>

            <h3 className="text-base font-black uppercase text-gray-900">
              Authorize Payment ({userName})
            </h3>
            <span className="text-2xl font-black text-blue-950 block my-1 font-mono">
              ₹{activeTransfer.amount.toLocaleString('en-IN')} to {activeTransfer.recipientName}
            </span>

            <p className="text-xs text-gray-500 mb-4 font-medium">
              Enter your 4-digit UPI PIN. Never share this PIN with anyone, including family members.
            </p>

            <div className="mb-4">
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-widest text-3xl py-2.5 border-2 border-gray-300 rounded-xl font-mono focus:outline-hidden focus:border-blue-700 bg-gray-50"
              />
              <span className="text-[10px] text-gray-400 font-bold block mt-1">Demo PIN: 1234</span>
              {pinError && <p className="text-xs text-red-600 font-bold mt-1">{pinError}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowPinModal(false)}
                className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-xs uppercase rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleUserConfirmPayment}
                className="py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase rounded-xl shadow-md"
              >
                Confirm &amp; Pay
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
              Payment Successful
            </h3>
            <span className="text-3xl font-black text-gray-900 block my-2 font-mono">
              ₹{showReceiptModal.amount.toLocaleString('en-IN')}
            </span>

            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-left text-xs space-y-2 my-4">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Recipient:</span>
                <span className="font-black text-gray-900">{showReceiptModal.recipient}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-gray-500 font-bold">UPI ID:</span>
                <span className="text-gray-700">{showReceiptModal.upi}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Reference:</span>
                <span className="font-mono text-[11px] font-bold text-gray-900">{showReceiptModal.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Trusted Circle:</span>
                <span className="text-purple-800 font-bold">{showReceiptModal.advisory}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceiptModal(null)}
              className="w-full py-2.5 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs uppercase rounded-xl cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
