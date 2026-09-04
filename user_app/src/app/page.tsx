"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Send, ShieldCheck, AlertTriangle, Clock, CheckCircle2,
  XCircle, User, Users, ArrowUpRight, ArrowDownLeft, RefreshCw,
  Phone, KeyRound, ChevronRight, Settings, Info, Sparkles, Volume2,
  FileText, ShieldAlert, History, Plus, Check, Play, Square, ExternalLink
} from 'lucide-react';

interface Beneficiary {
  id: string;
  name: string;
  upiId: string;
  avatar: string;
  history: {
    date: string;
    amount: number;
    description: string;
    monthsAgo: number;
  }[];
}

interface Transaction {
  id: string;
  recipientName: string;
  upiId: string;
  amount: number;
  date: string;
  time: string;
  status: 'SUCCESS' | 'QUEUED' | 'CANCELLED';
  verifiedViaHistory: boolean;
  notes: string;
  narrativeLog: string[];
}

interface QueuedTransfer {
  id: string;
  recipientName: string;
  upiId: string;
  amount: number;
  queuedAt: string;
  expiresInMinutes: number;
  reason: string;
  narrativeLog: string[];
}

const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'BEN-1',
    name: 'Dilshan Kumar',
    upiId: 'dilshan.k@okhdfcbank',
    avatar: '👨🏽‍💼',
    history: [
      { date: '12 Jan 2026', amount: 5000, description: 'Weekend Trip Expense', monthsAgo: 1 },
      { date: '04 Dec 2025', amount: 4200, description: 'Dinner Share', monthsAgo: 3 },
      { date: '18 Oct 2025', amount: 3500, description: 'Bookings', monthsAgo: 5 }
    ]
  },
  {
    id: 'BEN-2',
    name: 'Priya Sharma',
    upiId: 'priya.sharma@okicici',
    avatar: '👩🏻‍💻',
    history: [
      { date: '01 Feb 2026', amount: 8000, description: 'Apartment Rent Contribution', monthsAgo: 0.5 },
      { date: '01 Jan 2026', amount: 8000, description: 'Apartment Rent Contribution', monthsAgo: 2 },
      { date: '01 Dec 2025', amount: 8000, description: 'Apartment Rent Contribution', monthsAgo: 3 }
    ]
  },
  {
    id: 'BEN-3',
    name: 'Ramesh Patel',
    upiId: 'ramesh.patel@paytm',
    avatar: '👨🏽‍🌾',
    history: [
      { date: '15 Jan 2024', amount: 1500, description: 'Old Repair Payment', monthsAgo: 25 }
    ]
  },
  {
    id: 'BEN-4',
    name: 'Raj Cyber (Unknown)',
    upiId: 'raj.cyber.lottery99@ybl',
    avatar: '🕵️',
    history: []
  }
];

export default function UserBankingSimulator() {
  // Account State
  const [balance, setBalance] = useState(85450);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN-UPI-8849-01',
      recipientName: 'Dilshan Kumar',
      upiId: 'dilshan.k@okhdfcbank',
      amount: 5000,
      date: '12 Jan 2026',
      time: '14:23 IST',
      status: 'SUCCESS',
      verifiedViaHistory: true,
      notes: 'Verified against 6-month transaction frequency',
      narrativeLog: ['Voice transfer verified.', '3 prior transactions found within 6 months.']
    },
    {
      id: 'TXN-UPI-8849-02',
      recipientName: 'Priya Sharma',
      upiId: 'priya.sharma@okicici',
      amount: 8000,
      date: '01 Feb 2026',
      time: '10:05 IST',
      status: 'SUCCESS',
      verifiedViaHistory: true,
      notes: 'Recurring monthly trusted contact',
      narrativeLog: ['Recurring payee verified.']
    }
  ]);

  const [queue, setQueue] = useState<QueuedTransfer[]>([]);

  // Verification Settings
  const [lookbackMonths, setLookbackMonths] = useState(6);
  const [minPriorTransactions, setMinPriorTransactions] = useState(1);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  // Transfer Input State
  const [inputPrompt, setInputPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentNarrative, setCurrentNarrative] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<string>('');

  // Modals
  const [showReceiptModal, setShowReceiptModal] = useState<Transaction | null>(null);
  const [showVerifyOtpModal, setShowVerifyOtpModal] = useState<QueuedTransfer | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [showAddBeneficiaryModal, setShowAddBeneficiaryModal] = useState(false);
  const [newBenName, setNewBenName] = useState('');
  const [newBenUpi, setNewBenUpi] = useState('');
  const [newBenHistoryMonths, setNewBenHistoryMonths] = useState('none');

  // Twilio Call State
  const [callStatus, setCallStatus] = useState('');
  const [callingId, setCallingId] = useState<string | null>(null);

  // Web Speech Recognition Ref
  const recognitionRef = useRef<any>(null);

  // Text to Speech Helper
  const speakNarrative = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      // Prefer Indian English voice if available
      const voices = window.speechSynthesis.getVoices();
      const inVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India') || v.name.includes('Aditi'));
      if (inVoice) utterance.voice = inVoice;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    }
  };

  // Setup Web Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = false;
        reco.lang = 'en-IN';

        reco.onresult = (event: any) => {
          const speechText = event.results[0][0].transcript;
          setInputPrompt(speechText);
          setIsListening(false);
          handleExecuteTransfer(speechText);
        };

        reco.onerror = (err: any) => {
          console.error('Speech recognition error:', err);
          setIsListening(false);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = reco;
      }
    }
  }, [lookbackMonths, minPriorTransactions, beneficiaries, balance]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setIsListening(true);
        recognitionRef.current.start();
      } else {
        alert('Web Speech API is not supported in this browser. Please use the text input below.');
      }
    }
  };

  // Parser: Extract amount and recipient from speech or text
  const parseTransferCommand = (text: string): { amount: number; recipientQuery: string } | null => {
    const clean = text.toLowerCase().trim();
    
    // Match amounts: e.g. "5000", "5,000", "rs 5000", "₹5000", "5000 rupees", "five thousand"
    let amount = 0;
    const numMatch = clean.match(/(?:(?:rs\.?|inr|₹|rupees?)\s*)?(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:rupees?|rs\.?)?/i);
    if (numMatch && numMatch[1]) {
      amount = parseFloat(numMatch[1].replace(/,/g, ''));
    }

    // Common words map
    if (clean.includes('five thousand') || clean.includes('5 thousand')) amount = 5000;
    if (clean.includes('ten thousand') || clean.includes('10 thousand')) amount = 10000;
    if (clean.includes('two thousand') || clean.includes('2 thousand')) amount = 2000;
    if (clean.includes('eight thousand') || clean.includes('8 thousand')) amount = 8000;

    // Match recipient
    let recipientQuery = '';
    const toMatch = clean.match(/(?:send|transfer|pay|give)\s+(?:(?:rs\.?|inr|₹)?\s*\d+\s*(?:rupees?)?\s+)?to\s+([a-z0-9\s._@]+)/i);
    if (toMatch && toMatch[1]) {
      recipientQuery = toMatch[1].trim();
    } else {
      // Fallback: search beneficiaries
      for (const b of beneficiaries) {
        if (clean.includes(b.name.toLowerCase().split(' ')[0])) {
          recipientQuery = b.name;
          break;
        }
      }
    }

    if (!amount || !recipientQuery) return null;
    return { amount, recipientQuery };
  };

  // Core Transfer & Behavioral N-Month Verification Engine
  const handleExecuteTransfer = async (commandText: string) => {
    if (!commandText.trim()) return;
    setIsProcessing(true);
    setCurrentNarrative([]);
    setActiveStep('Parsing voice intent...');

    const parsed = parseTransferCommand(commandText);
    if (!parsed) {
      const errNarrative = [
        `❌ Could not understand voice command: "${commandText}"`,
        `Please try phrases like "Send 5000 to Dilshan" or "Pay ₹8,000 to Priya".`
      ];
      setCurrentNarrative(errNarrative);
      speakNarrative(`Sorry, I could not understand the recipient or amount. Please try again.`);
      setIsProcessing(false);
      setActiveStep('');
      return;
    }

    const { amount, recipientQuery } = parsed;

    // Step 1: Match Beneficiary
    const matchedBen = beneficiaries.find(b => 
      b.name.toLowerCase().includes(recipientQuery.toLowerCase()) ||
      b.upiId.toLowerCase().includes(recipientQuery.toLowerCase()) ||
      recipientQuery.toLowerCase().includes(b.name.toLowerCase().split(' ')[0])
    ) || {
      id: `BEN-${Date.now()}`,
      name: recipientQuery.charAt(0).toUpperCase() + recipientQuery.slice(1),
      upiId: `${recipientQuery.toLowerCase().replace(/\s+/g, '')}@upi`,
      avatar: '👤',
      history: []
    };

    const logs: string[] = [];
    logs.push(`🗣️ Voice Intent: Transfer ₹${amount.toLocaleString('en-IN')} to ${matchedBen.name} (${matchedBen.upiId})`);
    setCurrentNarrative([...logs]);
    setActiveStep(`Analyzing ${lookbackMonths}-month transaction history...`);
    speakNarrative(`Initiating transfer of ₹${amount} to ${matchedBen.name}. Checking your transaction history over the last ${lookbackMonths} months.`);

    await new Promise(r => setTimeout(r, 1600));

    // Step 2: Check N-Month History Rule
    const validHistoryInWindow = matchedBen.history.filter(h => h.monthsAgo <= lookbackMonths);
    const hasSufficientHistory = validHistoryInWindow.length >= minPriorTransactions;

    logs.push(`🔍 Historical Behavioral Check: Looking back ${lookbackMonths} months...`);
    logs.push(`📊 Found ${validHistoryInWindow.length} verified past transactions with ${matchedBen.name} in this window.`);

    if (hasSufficientHistory) {
      // SUCCESSFUL VERIFICATION PATH
      logs.push(`✅ Behavioral Verification Passed: ${matchedBen.name} is a trusted recipient.`);
      logs.push(`⚡ Executing Instant UPI Transfer of ₹${amount.toLocaleString('en-IN')}...`);
      setCurrentNarrative([...logs]);
      setActiveStep('Transfer completed successfully!');

      const newBal = balance - amount;
      setBalance(newBal);

      const newTxn: Transaction = {
        id: `TXN-UPI-${Date.now().toString().slice(-6)}`,
        recipientName: matchedBen.name,
        upiId: matchedBen.upiId,
        amount: amount,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST',
        status: 'SUCCESS',
        verifiedViaHistory: true,
        notes: `Instant transfer verified via ${validHistoryInWindow.length} past payments in last ${lookbackMonths} months`,
        narrativeLog: logs
      };

      setTransactions(prev => [newTxn, ...prev]);

      // Update beneficiary history with new payment
      setBeneficiaries(prev => prev.map(b => b.id === matchedBen.id ? {
        ...b,
        history: [{
          date: 'Just Now',
          amount: amount,
          description: 'Voice Transfer',
          monthsAgo: 0
        }, ...b.history]
      } : b));

      speakNarrative(`Transfer verified! ${matchedBen.name} is a verified recipient with ${validHistoryInWindow.length} previous transfers in the last ${lookbackMonths} months. ₹${amount} has been successfully sent. Your updated balance is ₹${newBal.toLocaleString('en-IN')}.`);

      setShowReceiptModal(newTxn);
    } else {
      // SAFETY HOLD & QUEUE PATH
      logs.push(`🛡️ Safety Triggered: Zero qualifying history found for ${matchedBen.name} in last ${lookbackMonths} months (Requires ≥${minPriorTransactions} prior payments).`);
      logs.push(`🔒 Action: Placed ₹${amount.toLocaleString('en-IN')} on protective 4-hour Cooling-Off Hold in the Safety Queue.`);
      logs.push(`🛡️ Reason: Anti-Fraud & Coercion Safeguard — Funds remain safe in your account.`);
      setCurrentNarrative([...logs]);
      setActiveStep('Transfer placed in Safety Hold Queue');

      const queueItem: QueuedTransfer = {
        id: `QUEUE-${Date.now().toString().slice(-6)}`,
        recipientName: matchedBen.name,
        upiId: matchedBen.upiId,
        amount: amount,
        queuedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        expiresInMinutes: 240, // 4 Hours
        reason: matchedBen.history.length === 0
          ? `First-time recipient: No payment history in the last ${lookbackMonths} months.`
          : `Dormant recipient: Last transfer was ${matchedBen.history[0]?.monthsAgo} months ago (> ${lookbackMonths} month threshold).`,
        narrativeLog: logs
      };

      setQueue(prev => [queueItem, ...prev]);

      speakNarrative(`Security Alert: No previous transfers found for ${matchedBen.name} in the last ${lookbackMonths} months. To protect your funds from unauthorized transfers or fraud, this transaction of ₹${amount} is held in your protective safety queue for 4 hours. You can verify it with your secure PIN or phone call.`);
    }

    setIsProcessing(false);
  };

  // Verify and Release Queued Transfer via OTP / PIN
  const handleReleaseQueuedTransfer = (q: QueuedTransfer) => {
    if (otpInput !== '1234') {
      setOtpError('Invalid PIN. For simulation demo, enter 1234.');
      return;
    }

    setBalance(prev => prev - q.amount);
    setQueue(prev => prev.filter(item => item.id !== q.id));

    const newTxn: Transaction = {
      id: `TXN-REL-${Date.now().toString().slice(-6)}`,
      recipientName: q.recipientName,
      upiId: q.upiId,
      amount: q.amount,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST',
      status: 'SUCCESS',
      verifiedViaHistory: false,
      notes: 'Released from Safety Queue via Step-Up PIN Authorization',
      narrativeLog: [...q.narrativeLog, '🔓 Released from Safety Hold via verified user PIN.']
    };

    setTransactions(prev => [newTxn, ...prev]);
    setShowVerifyOtpModal(null);
    setOtpInput('');
    setOtpError('');

    speakNarrative(`PIN verified. Transfer of ₹${q.amount} to ${q.recipientName} has been released and completed.`);
    setShowReceiptModal(newTxn);
  };

  // Cancel Queued Transfer
  const handleCancelQueuedTransfer = (queueId: string) => {
    const item = queue.find(q => q.id === queueId);
    setQueue(prev => prev.filter(q => q.id !== queueId));
    if (item) {
      setTransactions(prev => [{
        id: `TXN-CANC-${Date.now().toString().slice(-6)}`,
        recipientName: item.recipientName,
        upiId: item.upiId,
        amount: item.amount,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST',
        status: 'CANCELLED',
        verifiedViaHistory: false,
        notes: 'Transfer cancelled by user during protective safety cooling-off period',
        narrativeLog: [...item.narrativeLog, '✕ Cancelled by user during safety cooling-off period.']
      }, ...prev]);
      speakNarrative(`Transfer of ₹${item.amount} to ${item.recipientName} has been cancelled. No funds were debited.`);
    }
  };

  // Dispatch Twilio Voice Call for Queued Transfer
  const handleTwilioVerificationCall = async (q: QueuedTransfer) => {
    setCallingId(q.id);
    setCallStatus('Connecting with Twilio Voice Copilot...');
    try {
      const script = `Hello Rohan! This is an urgent safety notification from your SafePay AI Protection System. We held a transfer of ₹${q.amount} to ${q.recipientName} because you have not sent money to this account in the last ${lookbackMonths} months. If you authorized this transfer, please approve in your app. Thank you!`;
      const res = await fetch('http://localhost:8000/api/v1/cases/voice/direct-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: '+919461284678',
          language: 'en',
          custom_message: script
        })
      });
      const data = await res.json();
      if (data.success) {
        setCallStatus(`✓ Verification call dialed to +919461284678 (Call SID: ${data.call_sid})`);
      } else {
        setCallStatus(`✕ Twilio Call error: ${data.error}`);
      }
    } catch (e) {
      setCallStatus('✕ Could not reach backend server on port 8000.');
    } finally {
      setCallingId(null);
    }
  };

  // Add Custom Beneficiary
  const handleAddBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenName.trim() || !newBenUpi.trim()) return;

    let hist: any[] = [];
    if (newBenHistoryMonths === 'recent') {
      hist = [
        { date: '10 Jan 2026', amount: 3000, description: 'Past Transfer', monthsAgo: 1 },
        { date: '15 Nov 2025', amount: 4500, description: 'Past Transfer', monthsAgo: 3 }
      ];
    } else if (newBenHistoryMonths === 'old') {
      hist = [
        { date: '01 Jan 2024', amount: 2000, description: 'Old Transfer', monthsAgo: 24 }
      ];
    }

    const newBen: Beneficiary = {
      id: `BEN-${Date.now()}`,
      name: newBenName.trim(),
      upiId: newBenUpi.trim(),
      avatar: '👤',
      history: hist
    };

    setBeneficiaries(prev => [...prev, newBen]);
    setShowAddBeneficiaryModal(false);
    setNewBenName('');
    setNewBenUpi('');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-900 pb-16">
      {/* Top Mobile/Web Navigation Bar */}
      <header className="bg-[#1E3A8A] text-white border-b-4 border-blue-950 sticky top-0 z-40 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-blue-950 font-black flex items-center justify-center text-lg shadow-sm">
              ₹
            </div>
            <div>
              <h1 className="font-black text-sm tracking-wide uppercase flex items-center gap-1.5">
                SafePay India <span className="bg-amber-400 text-blue-950 text-[10px] px-1.5 py-0.2 font-black rounded-xs">AI VOICE</span>
              </h1>
              <p className="text-[10px] text-blue-200 font-bold">Behavioral N-Month Safety & Voice Transfer Simulator</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-blue-900/80 px-3 py-1.5 rounded-sm border border-blue-700">
              <ShieldCheck size={16} className="text-emerald-400" />
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider text-blue-300 block font-bold">Fraud Shield</span>
                <span className="text-xs font-black text-white">Active ({lookbackMonths}M Lookback)</span>
              </div>
            </div>

            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="px-2.5 py-1.5 bg-amber-400 text-blue-950 font-black text-xs uppercase rounded-sm hover:bg-amber-300 flex items-center gap-1 shadow-sm"
              title="Open Bank Copilot (Port 3001)"
            >
              <span>Copilot Admin</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Account Balance Card */}
        <div className="bg-gradient-to-br from-[#1E3A8A] to-[#172554] text-white p-6 rounded-lg shadow-lg border-2 border-blue-900 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldCheck size={180} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-blue-200 text-xs font-bold mb-1">
                <User size={14} /> Rohan Sharma · <span className="font-mono">rohan.sharma@okaxis</span>
              </div>
              <span className="text-xs font-black uppercase text-blue-300 tracking-wider">Available Savings Balance</span>
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-0.5">
                ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="bg-blue-900/80 p-3 rounded-md border border-blue-700">
                <span className="text-[10px] font-black uppercase text-blue-300 block mb-1">
                  Safety Lookback Window (N Months)
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={lookbackMonths}
                    onChange={(e) => setLookbackMonths(parseInt(e.target.value))}
                    className="w-32 accent-amber-400 cursor-pointer"
                  />
                  <span className="text-xs font-black text-amber-300 bg-blue-950 px-2 py-0.5 rounded-sm border border-blue-800">
                    {lookbackMonths} Months
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NARRATIVE VOICE TRANSFER COMMAND CENTER */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                <Volume2 size={16} />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wide text-gray-900">
                  Narrative Voice Transfer Copilot
                </h2>
                <p className="text-[11px] text-gray-500 font-bold">
                  Speak naturally to transfer funds. AI automatically verifies recipient history over the last {lookbackMonths} months.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-1.5 rounded-sm border text-xs font-bold flex items-center gap-1 cursor-pointer ${
                  speechEnabled ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-500 border-gray-300'
                }`}
                title="Toggle Speech Audio Narration"
              >
                <Volume2 size={13} className={speechEnabled ? 'text-emerald-700' : 'text-gray-400'} />
                <span className="text-[10px]">{speechEnabled ? 'Voice ON' : 'Mute'}</span>
              </button>
            </div>
          </div>

          {/* Voice Input Box */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleExecuteTransfer(inputPrompt)}
                  placeholder="e.g. 'Send 5000 to Dilshan' or 'Transfer ₹8,000 to Priya'"
                  className="w-full pl-4 pr-10 py-3 border-2 border-gray-300 rounded-md text-sm font-bold focus:outline-hidden focus:border-blue-700 bg-gray-50"
                />
                {inputPrompt && (
                  <button
                    onClick={() => setInputPrompt('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 font-bold text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Big Voice Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`px-5 py-3 rounded-md font-black text-xs uppercase flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-200'
                    : 'bg-blue-900 hover:bg-blue-800 text-white'
                }`}
                title="Speak to transfer"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                <span>{isListening ? 'Listening...' : 'Voice Transfer'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleExecuteTransfer(inputPrompt)}
                disabled={isProcessing || !inputPrompt.trim()}
                className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs uppercase rounded-md flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                <span>Send</span>
              </button>
            </div>

            {/* Quick Demo Voice Scenario Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1">
                <Sparkles size={11} className="text-amber-500" /> One-Click Demo Scenarios:
              </span>

              <button
                type="button"
                onClick={() => {
                  setInputPrompt('Send 5000 to Dilshan');
                  handleExecuteTransfer('Send 5000 to Dilshan');
                }}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-sm text-xs font-bold cursor-pointer transition-colors"
              >
                🟢 Send ₹5,000 to Dilshan (3 Past Transfers → Instant Pass)
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputPrompt('Send 8000 to Priya');
                  handleExecuteTransfer('Send 8000 to Priya');
                }}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-sm text-xs font-bold cursor-pointer transition-colors"
              >
                🟢 Pay ₹8,000 to Priya (Frequent Payee → Instant Pass)
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputPrompt('Send 1500 to Ramesh');
                  handleExecuteTransfer('Send 1500 to Ramesh');
                }}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-sm text-xs font-bold cursor-pointer transition-colors"
              >
                🟡 Send ₹1,500 to Ramesh (&gt;12M Inactive → Queue Hold)
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputPrompt('Send 12000 to Raj Cyber');
                  handleExecuteTransfer('Send 12000 to Raj Cyber');
                }}
                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-900 border border-red-300 rounded-sm text-xs font-bold cursor-pointer transition-colors"
              >
                🔴 Send ₹12,000 to Raj Cyber (0 History → Fraud Queue Hold)
              </button>
            </div>
          </div>

          {/* LIVE NARRATIVE BREAKDOWN PANEL */}
          {currentNarrative.length > 0 && (
            <div className="mt-4 p-4 bg-gray-900 text-white rounded-md border-2 border-gray-800 shadow-inner">
              <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    AI Behavioral Voice Engine Log
                  </span>
                </div>
                {activeStep && (
                  <span className="text-[11px] font-mono text-gray-300 bg-gray-800 px-2 py-0.5 rounded-sm">
                    {activeStep}
                  </span>
                )}
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {currentNarrative.map((line, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      line.includes('✅')
                        ? 'text-emerald-400 font-bold'
                        : line.includes('🛡️') || line.includes('🔒')
                        ? 'text-amber-300 font-bold'
                        : line.includes('❌')
                        ? 'text-red-400 font-bold'
                        : 'text-gray-200'
                    }`}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2-COLUMN GRID: BENEFICIARY DIRECTORY + PROTECTIVE SAFETY HOLD QUEUE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* COLUMN 1: BENEFICIARY DIRECTORY WITH N-MONTH HISTORY */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-5 shadow-sm">
            <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-blue-900" />
                <h3 className="text-sm font-black uppercase text-gray-900">
                  Beneficiary Directory &amp; Past Transfers
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddBeneficiaryModal(true)}
                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs font-bold rounded-sm flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} /> Add Contact
              </button>
            </div>

            <div className="space-y-3">
              {beneficiaries.map((ben) => {
                const recentTransfers = ben.history.filter(h => h.monthsAgo <= lookbackMonths);
                const isTrusted = recentTransfers.length >= minPriorTransactions;

                return (
                  <div
                    key={ben.id}
                    className={`p-3.5 rounded-md border-2 transition-all ${
                      isTrusted ? 'border-emerald-200 bg-emerald-50/40' : 'border-amber-200 bg-amber-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{ben.avatar}</span>
                        <div>
                          <h4 className="font-black text-xs text-gray-900">{ben.name}</h4>
                          <span className="text-[10px] text-gray-500 font-mono">{ben.upiId}</span>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-xs ${
                          isTrusted ? 'bg-emerald-700 text-white' : 'bg-amber-700 text-white'
                        }`}
                      >
                        {isTrusted ? `Verified (In ${lookbackMonths}M)` : `Unverified / Dormant`}
                      </span>
                    </div>

                    {/* Past Transfers in Window */}
                    <div className="text-[11px] text-gray-600 bg-white p-2 rounded-sm border border-gray-200 mb-2">
                      <div className="font-bold text-gray-700 mb-1 flex items-center justify-between text-[10px] uppercase">
                        <span>Past History ({lookbackMonths}M Window):</span>
                        <span className="font-black text-blue-900">{recentTransfers.length} Transfers</span>
                      </div>
                      {ben.history.length === 0 ? (
                        <span className="text-red-600 italic text-[10px]">No historical payments found.</span>
                      ) : (
                        <div className="space-y-0.5">
                          {ben.history.map((h, hidx) => (
                            <div key={hidx} className="flex items-center justify-between text-[10px]">
                              <span className={h.monthsAgo <= lookbackMonths ? 'text-gray-800' : 'text-gray-400 line-through'}>
                                • {h.date} ({h.description})
                              </span>
                              <span className="font-mono font-bold text-gray-900">
                                ₹{h.amount.toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Transfer Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const amt = isTrusted ? 5000 : 2500;
                        setInputPrompt(`Send ${amt} to ${ben.name.split(' ')[0]}`);
                        handleExecuteTransfer(`Send ${amt} to ${ben.name.split(' ')[0]}`);
                      }}
                      className="w-full py-1.5 bg-white hover:bg-gray-50 border border-gray-300 text-xs font-black uppercase text-blue-900 rounded-sm flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <ArrowUpRight size={13} /> Send Money to {ben.name.split(' ')[0]}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: PROTECTIVE SAFETY HOLD QUEUE */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-amber-600" />
                  <h3 className="text-sm font-black uppercase text-gray-900">
                    Protective Safety Hold Queue
                  </h3>
                </div>
                <span className="text-xs font-black bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                  {queue.length} Active Holds
                </span>
              </div>

              {queue.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-md bg-gray-50 my-4">
                  <ShieldCheck size={36} className="mx-auto text-emerald-500 mb-2" />
                  <h4 className="text-xs font-black uppercase text-gray-700">Safety Queue Empty</h4>
                  <p className="text-[11px] text-gray-500 mt-1 max-w-xs mx-auto">
                    When you transfer to an unverified contact without prior history in the last {lookbackMonths} months, it safely enters this protective cooling-off queue.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {queue.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 bg-amber-50/60 border-2 border-amber-300 rounded-md shadow-xs relative"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded-xs">
                            Cooling-Off Period (4-Hour Hold)
                          </span>
                          <h4 className="font-black text-sm text-gray-900 mt-1">
                            ₹{q.amount.toLocaleString('en-IN')} to {q.recipientName}
                          </h4>
                          <span className="text-[10px] font-mono text-gray-500">{q.upiId}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 font-bold block">Queued At</span>
                          <span className="text-xs font-bold text-gray-700">{q.queuedAt}</span>
                        </div>
                      </div>

                      <div className="p-2 bg-white border border-amber-200 rounded-sm text-xs text-amber-900 font-medium mb-3">
                        <strong>Reason:</strong> {q.reason}
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowVerifyOtpModal(q);
                            setOtpInput('');
                            setOtpError('');
                          }}
                          className="py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase rounded-sm flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <KeyRound size={13} /> Verify &amp; Send
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTwilioVerificationCall(q)}
                          disabled={callingId === q.id}
                          className="py-1.5 bg-blue-900 hover:bg-blue-800 text-white font-black text-xs uppercase rounded-sm flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
                          title="Trigger AI call to +919461284678"
                        >
                          {callingId === q.id ? <RefreshCw size={13} className="animate-spin" /> : <Phone size={13} />}
                          <span>AI Phone Call</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancelQueuedTransfer(q.id)}
                          className="py-1.5 bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 font-black text-xs uppercase rounded-sm flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <XCircle size={13} /> Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {callStatus && (
              <div className={`mt-4 p-2.5 text-xs font-bold border rounded-md ${
                callStatus.startsWith('✓') ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-red-50 border-red-300 text-red-700'
              }`}>
                {callStatus}
              </div>
            )}
          </div>
        </div>

        {/* RECENT TRANSACTION LEDGER & DIGITAL AUDIT TRAIL */}
        <div className="bg-white border-2 border-gray-300 rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <History size={18} className="text-blue-900" />
              <h3 className="text-sm font-black uppercase text-gray-900">
                Live Transaction Ledger &amp; Digital Receipts
              </h3>
            </div>
            <span className="text-xs font-bold text-gray-500">
              {transactions.length} Total Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300 text-gray-700 uppercase font-black text-[10px]">
                  <th className="p-2.5">Transaction ID</th>
                  <th className="p-2.5">Recipient</th>
                  <th className="p-2.5">Amount</th>
                  <th className="p-2.5">Date &amp; Time</th>
                  <th className="p-2.5">Safety Status</th>
                  <th className="p-2.5 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-medium">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-2.5 font-mono text-[11px] font-bold text-gray-600">{txn.id}</td>
                    <td className="p-2.5 font-bold text-gray-900">
                      {txn.recipientName}
                      <span className="block text-[10px] text-gray-400 font-normal font-mono">{txn.upiId}</span>
                    </td>
                    <td className="p-2.5 font-black text-sm text-gray-900">
                      ₹{txn.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2.5 text-gray-500 text-[11px]">
                      {txn.date} · {txn.time}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-xs ${
                          txn.status === 'SUCCESS'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : txn.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {txn.status === 'SUCCESS' ? '✓ Completed' : txn.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => setShowReceiptModal(txn)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-sm text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                      >
                        <FileText size={12} /> Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* DIGITAL RECEIPT MODAL */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-blue-950 w-full max-w-sm rounded-lg shadow-2xl p-6 text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={28} />
            </div>

            <h3 className="text-lg font-black uppercase text-gray-900">
              {showReceiptModal.status === 'SUCCESS' ? 'Payment Successful' : 'Transaction Summary'}
            </h3>
            <span className="text-3xl font-black text-gray-900 block my-2">
              ₹{showReceiptModal.amount.toLocaleString('en-IN')}
            </span>

            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-left text-xs space-y-1.5 my-4">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Paid To:</span>
                <span className="font-black text-gray-900">{showReceiptModal.recipientName}</span>
              </div>
              <div className="flex justify-between font-mono text-[11px]">
                <span className="text-gray-500 font-bold">UPI ID:</span>
                <span className="text-gray-700">{showReceiptModal.upiId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Reference:</span>
                <span className="font-mono text-[11px] font-bold text-gray-900">{showReceiptModal.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold">Verification:</span>
                <span className="text-emerald-700 font-bold">
                  {showReceiptModal.verifiedViaHistory ? '✓ N-Month History Pass' : '✓ Authorized via PIN'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowReceiptModal(null)}
              className="w-full py-2 bg-blue-950 hover:bg-blue-900 text-white font-black text-xs uppercase rounded-sm cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* STEP-UP PIN VERIFICATION MODAL */}
      {showVerifyOtpModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-amber-500 w-full max-w-sm rounded-lg shadow-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound size={20} className="text-amber-600" />
              <h3 className="text-sm font-black uppercase text-gray-900">
                Step-Up PIN Verification
              </h3>
            </div>

            <p className="text-xs text-gray-600 mb-4 font-medium leading-relaxed">
              Confirm transfer of <strong>₹{showVerifyOtpModal.amount.toLocaleString('en-IN')}</strong> to{' '}
              <strong>{showVerifyOtpModal.recipientName}</strong>. Enter your 4-digit UPI PIN to override safety hold.
            </p>

            <div className="mb-4">
              <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">
                Enter 4-Digit UPI PIN (Demo: 1234)
              </label>
              <input
                type="password"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-widest text-2xl py-2 border-2 border-gray-300 rounded-md font-mono focus:outline-hidden focus:border-amber-600"
              />
              {otpError && <p className="text-xs text-red-600 font-bold mt-1">{otpError}</p>}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowVerifyOtpModal(null)}
                className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase rounded-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleReleaseQueuedTransfer(showVerifyOtpModal)}
                className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase rounded-sm cursor-pointer"
              >
                Authorize &amp; Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD BENEFICIARY MODAL */}
      {showAddBeneficiaryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-blue-900 w-full max-w-md rounded-lg shadow-2xl p-6">
            <div className="flex items-center justify-between border-b-2 border-gray-200 pb-3 mb-4">
              <h3 className="text-sm font-black uppercase text-gray-900 flex items-center gap-1.5">
                <Users size={16} className="text-blue-900" /> Add New Beneficiary
              </h3>
              <button onClick={() => setShowAddBeneficiaryModal(false)} className="font-bold text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleAddBeneficiary} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={newBenName}
                  onChange={(e) => setNewBenName(e.target.value)}
                  className="w-full p-2.5 border-2 border-gray-300 rounded-sm text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ananya@okaxis"
                  value={newBenUpi}
                  onChange={(e) => setNewBenUpi(e.target.value)}
                  className="w-full p-2.5 border-2 border-gray-300 rounded-sm text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1">Simulated Past History</label>
                <select
                  value={newBenHistoryMonths}
                  onChange={(e) => setNewBenHistoryMonths(e.target.value)}
                  className="w-full p-2.5 border-2 border-gray-300 rounded-sm text-xs font-bold"
                >
                  <option value="none">Zero Past Transfers (New Unverified Recipient)</option>
                  <option value="recent">Recent Transfers (2 payments in last 3 months - Trusted)</option>
                  <option value="old">Dormant Transfer (1 payment 24 months ago - Stale)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBeneficiaryModal(false)}
                  className="px-4 py-2 border-2 border-gray-300 text-xs font-bold uppercase rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-900 text-white text-xs font-black uppercase rounded-sm"
                >
                  Save Beneficiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
