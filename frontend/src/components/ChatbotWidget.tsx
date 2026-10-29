import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Phone,
  Calendar,
  Sparkles,
  ChevronRight,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  quickReplies?: string[];
  actionLink?: {
    label: string;
    href: string;
    isExternal?: boolean;
  };
}

interface ChatbotWidgetProps {
  companyPhone?: string;
}

const FAQ_KNOWLEDGE_BASE = [
  {
    keywords: [
      "rate",
      "cost",
      "price",
      "kitna",
      "kharcha",
      "bhav",
      "charges",
      "sq ft",
      "square feet",
    ],
    category: "Pricing & Quotation",
    answer:
      "💰 **Rates & Pricing (Famtima Traders):**\n\n• **POP Work / False Ceiling:** Contact for best customized pricing\n• **PVC Wall Panelling:** 100% waterproof louvers & panels at direct rates\n• **Home Decoration & Renovation:** Complete turnkey quotes\n\n✨ Hum site inspection aur measurements ke baad transparent itemized estimate provide karte hain!",
    quickReplies: [
      "Free Site Visit Kaise Book Kare?",
      "POP vs PVC difference kya hai?",
      "Call directly",
    ],
  },
  {
    keywords: ["pop", "plaster of paris", "cove", "ceiling", "false ceiling"],
    category: "POP False Ceiling",
    answer:
      "✨ **POP Work & False Ceiling Services:**\n\nHum high-quality Plaster of Paris false ceiling banate hain with:\n- Designer Cove LED Lighting channels\n- Modern geometric, curved & layered patterns\n- Heavy-load reinforcement for fans & chandeliers\n- Smooth long-lasting finish\n\nBemetara aur poore Chhattisgarh me hamari expert team available hai!",
    quickReplies: ["POP Ceiling pricing?", "Kitna time lagta hai?", "Site visit book karein"],
  },
  {
    keywords: ["pvc", "waterproof", "damp", "seelan", "nami", "wall panel", "louver", "louvers"],
    category: "PVC Wall Panels",
    answer:
      "🛡️ **PVC Wall Panelling & Ceiling (100% Waterproof):**\n\nDeewaro ki nami (seelan) aur premium look ke liye PVC panels best hain:\n- 100% Waterproof & Termite-Proof (Deemak-mukt)\n- Fast, clean installation in 24–48 hours\n- Wooden grain, marble finish aur fluted louvers\n\nLiving Room TV units, Bedroom feature walls aur shops ke liye perfect!",
    quickReplies: [
      "PVC quotation kaise milegi?",
      "POP vs PVC me kaunsa best hai?",
      "Site visit book karein",
    ],
  },
  {
    keywords: ["time", "duration", "din", "kitne din", "how long", "speed"],
    category: "Timeline",
    answer:
      "⏱️ **Project Completion Timeline:**\n\n• **1BHK / Hall:** 3 se 5 working days\n• **2BHK / 3BHK Home:** 6 se 12 working days\n• **PVC Wall Panelling:** 1-2 din me complete\n\nHamari experienced team committed timeline par work deliver karti hai.",
    quickReplies: ["Get a Quote", "Free Site Visit Kaise Book Kare?"],
  },
  {
    keywords: [
      "visit",
      "inspection",
      "site visit",
      "nap",
      "measurement",
      "estimate",
      "quotation",
      "quote",
      "book",
    ],
    category: "Site Visit & Quotation",
    answer:
      "📐 **Site Visit & Measurement in Bemetara & Chhattisgarh:**\n\nFamtima Traders Bemetara aur surrounding areas me prompt Site Visit & Measurement provide karta hai.\n\nHum actual material designs ke sath aapki site par aakar exact measurement aur estimate dete hain.",
    quickReplies: ["WhatsApp par quote lein", "Call karke book karein"],
    actionLink: {
      label: "📲 WhatsApp par Contact Karein",
      href: "https://wa.me/917860854662?text=Hi%20Famtima%20Traders,%20mujhe%20site%20visit%20aur%20quotation%20chahiye",
      isExternal: true,
    },
  },
  {
    keywords: [
      "area",
      "location",
      "kaha",
      "where",
      "service area",
      "bemetara",
      "krishna vihar",
      "chhattisgarh",
      "raipur",
      "durg",
      "bhilai",
    ],
    category: "Service Areas",
    answer:
      "📍 **Service Locations (Bemetara & Across Chhattisgarh):**\n\nHum Bemetara town aur poore Chhattisgarh me services provide karte hain:\n• Krishna Vihar & Bemetara City\n• Durg, Bhilai & Raipur\n• Bilaspur & Rajnandgaon\n• Kawardha (Kabirdham), Mungeli, Saja, Simga & nearby towns",
    quickReplies: ["Site visit book karein", "Contact details", "WhatsApp Quote"],
  },
  {
    keywords: ["contact", "phone", "mobile", "number", "call", "whatsapp", "address", "office"],
    category: "Contact Info",
    answer:
      "📞 **Famtima Traders Contact Details:**\n\n• **Proprietor:** Anwar Khan\n• **Primary Phone / WhatsApp:** [+91 7860854662](tel:+917860854662)\n• **Alternate Phone:** [+91 9265012186](tel:+919265012186)\n• **Email:** anwaarrza850@gmail.com\n• **Address:** Shop No. 08, Krishna Vihar, Bemetara, Chhattisgarh, PIN 491335, India\n• **Hours:** 9:00 AM – 8:00 PM (Monday to Sunday)",
    quickReplies: ["WhatsApp Message Karein", "Get a Quote", "Book Site Visit"],
    actionLink: {
      label: "📞 Call +91 7860854662",
      href: "tel:+917860854662",
    },
  },
  {
    keywords: ["bill", "invoice", "receipt", "fake", "original", "pukka", "rate"],
    category: "Official Billing & Invoices",
    answer:
      "🛡️ **Official Billing & Transparency:**\n\nFamtima Traders ke official quotations, bills aur receipts transparent itemized format mein provide kiye jaate hain jisme material specifications aur crystal-clear pricing hoti hai.",
    quickReplies: ["Contact details", "Free site visit"],
  },
];

const INITIAL_QUICK_REPLIES = [
  "Get a Quote / Pricing",
  "Free Site Visit kaise book kare?",
  "POP vs PVC difference kya hai?",
  "Contact / Phone number?",
];

export function ChatbotWidget({ companyPhone = "7860854662" }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "bot",
      text: "👋 Namaste! Welcome to **Famtima Traders, Bemetara**.\n\nMain aapka virtual assistant hoon. Home Decoration, POP False Ceiling, PVC Wall Panelling, ya Chhattisgarh me Site Visit ke baare me koi bhi sawal ho, aap yahan puch sakte hain!",
      time: getCurrentTime(),
      quickReplies: INITIAL_QUICK_REPLIES,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function renderFormattedMessage(content: string) {
    const lines = content.split("\n");
    return lines.map((line, lIdx) => {
      // Parse markdown bold: **text**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={lIdx} className="block min-h-[1.1rem]">
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="font-semibold text-slate-900">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </span>
      );
    });
  }

  const findBestAnswer = (userQuery: string) => {
    const query = userQuery.toLowerCase().trim();

    // Direct greeting check
    if (/^(hi|hello|hey|namaste|salaam|assalam|pranam|ram ram)/i.test(query)) {
      return {
        answer:
          "Hello! Kaise hain aap? Famtima Traders me aapka swagat hai. POP False Ceiling, PVC wall panelling, ya site inspection ke baare me aap kya janna chahte hain?",
        quickReplies: INITIAL_QUICK_REPLIES,
      };
    }

    // Direct thank you check
    if (/^(thanks|thank you|shukriya|dhanyawad)/i.test(query)) {
      return {
        answer:
          "Aapka swagat hai! Agar koi aur sawal ho ya site visit book karni ho, toh batayein. Have a great day! 😊",
        quickReplies: ["Free Site Visit Book Karein", "Call Famtima Traders"],
      };
    }

    // Match keywords score
    let bestMatch: (typeof FAQ_KNOWLEDGE_BASE)[0] | null = null;
    let highestScore = 0;

    for (const item of FAQ_KNOWLEDGE_BASE) {
      let score = 0;
      for (const kw of item.keywords) {
        if (query.includes(kw)) {
          score += kw.length; // weight longer keywords more
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && highestScore > 0) {
      return {
        answer: bestMatch.answer,
        quickReplies: bestMatch.quickReplies,
        actionLink: bestMatch.actionLink,
      };
    }

    // Default Fallback
    return {
      answer:
        "Dhanyawad aapke question ke liye! Is vishay par hamare master craftsman aapko sabse behtar guide kar sakte hain.\n\nAap directly call kar sakte hain ya WhatsApp par photo/plans bhej kar turant estimation le sakte hain:",
      quickReplies: [
        "Rates & Pricing kya hai?",
        "Free Site Visit kaise book kare?",
        "Contact / Phone number?",
      ],
      actionLink: {
        label: `📲 WhatsApp (+91 ${companyPhone})`,
        href: `https://wa.me/91${companyPhone}?text=Hi%20Famtima%20Traders,%20mujhe%20ek%20inquiry%20karni%20hai:%20${encodeURIComponent(userQuery)}`,
        isExternal: true,
      },
    };
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const result = findBestAnswer(text);
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: result.answer,
        time: getCurrentTime(),
        quickReplies: result.quickReplies,
        actionLink: result.actionLink,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "bot",
        text: "Conversation reset ho gayi hai. Welcome back! Main aapki kya madad kar sakta hoon?",
        time: getCurrentTime(),
        quickReplies: INITIAL_QUICK_REPLIES,
      },
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-3 sm:right-6 z-40 md:z-50 flex items-center">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 mr-3 px-3 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-lg border border-slate-200 animate-bounce">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            Any Questions? Ask AI
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI Chatbot" : "Open AI Chatbot"}
          className={`group relative flex size-12 sm:size-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400 ${
            isOpen
              ? "bg-slate-900 text-white hover:bg-slate-800 rotate-90"
              : "bg-gradient-to-tr from-emerald-800 via-emerald-700 to-amber-600 text-white hover:scale-105 hover:shadow-emerald-600/50"
          }`}
        >
          {isOpen ? (
            <X className="size-5 sm:size-6 transition-transform" />
          ) : (
            <>
              <MessageSquare className="size-5 sm:size-6 transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex size-4">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-4 rounded-full bg-emerald-500 text-[9px] font-bold text-white items-center justify-center">
                  1
                </span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-24 right-2 sm:right-6 left-2 sm:left-auto z-50 flex w-[calc(100vw-1rem)] sm:w-[400px] max-w-[420px] h-[min(540px,calc(100dvh-6.5rem-env(safe-area-inset-top,0px)-env(safe-area-inset-bottom,0px)))] max-h-[calc(100dvh-6.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-800 bg-gradient-to-r from-emerald-950 via-emerald-800 to-teal-900 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex size-10 items-center justify-center rounded-full bg-emerald-700/80 ring-2 ring-amber-400/50">
                <Bot className="size-5 text-amber-300" />
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight">Famtima Traders AI</h3>
                  <span className="rounded-full bg-amber-400/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">
                    Bemetara
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> Online • Home Decor
                  Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Restart Chat"
                className="rounded-lg p-1.5 text-emerald-200 hover:bg-emerald-700/50 hover:text-white transition-colors"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-emerald-200 hover:bg-emerald-700/50 hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-emerald-50/80 px-3 py-1.5 border-b border-emerald-100 flex items-center justify-between text-[11px] text-emerald-950">
            <span className="flex items-center gap-1 font-medium">
              <Sparkles className="size-3 text-amber-600" /> Home Decor &amp; Panelling Experts
            </span>
            <a
              href={`tel:+91${companyPhone}`}
              className="flex items-center gap-1 font-bold text-emerald-800 hover:underline"
            >
              <Phone className="size-3" /> Call: {companyPhone}
            </a>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`flex max-w-[85%] items-end gap-2 ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      msg.sender === "user"
                        ? "bg-emerald-700 text-white"
                        : "bg-emerald-950 text-amber-300"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="size-3.5" />
                    ) : (
                      <Bot className="size-3.5" />
                    )}
                  </div>

                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-emerald-700 text-white rounded-br-xs whitespace-pre-wrap"
                        : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                    }`}
                  >
                    {renderFormattedMessage(msg.text)}

                    {msg.actionLink && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <a
                          href={msg.actionLink.href}
                          target={msg.actionLink.isExternal ? "_blank" : undefined}
                          rel={msg.actionLink.isExternal ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors shadow-xs"
                        >
                          {msg.actionLink.label}
                          <ExternalLink className="size-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-8">{msg.time}</span>

                {/* Quick reply suggestions if sent by bot */}
                {msg.sender === "bot" && msg.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 mt-2 ml-8 max-w-[90%]">
                    {msg.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(reply)}
                        className="rounded-full border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 px-2.5 py-1 text-[11px] font-medium text-emerald-800 transition-colors shadow-2xs flex items-center gap-1"
                      >
                        {reply}
                        <ChevronRight className="size-3 text-emerald-600" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                <Bot className="size-4 text-emerald-600 animate-spin" />
                <span className="animate-pulse">Famtima AI soch raha hai...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t border-slate-200 bg-white p-2.5 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="POP work, PVC panelling, ya koi sawal puchein..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex size-9 items-center justify-center rounded-xl bg-emerald-700 text-white disabled:opacity-40 hover:bg-emerald-800 transition-colors shadow-xs"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
