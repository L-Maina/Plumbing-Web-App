"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  X, 
  Send, 
  HeadphonesIcon,
  Minimize2,
  Bot,
  Loader2,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "support";
  message: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  sender: "bot",
  message: "Hello! 👋 I'm the Climate Tech AI assistant. I can help you with plumbing questions and service inquiries. How can I help you today?",
  timestamp: new Date(),
};

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [nameEntered, setNameEntered] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [handoffRequested, setHandoffRequested] = useState(false);
  const [handoffAccepted, setHandoffAccepted] = useState(false);
  const [takenOver, setTakenOver] = useState(false);
  const [conversationFinished, setConversationFinished] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Create a session when chat opens and name is entered
  useEffect(() => {
    if (isOpen && nameEntered && !sessionId) {
      createSession();
    }
  }, [isOpen, nameEntered, sessionId]);

  const createSession = async () => {
    try {
      const response = await fetch("/api/chat/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSessionId(data.id);
      }
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleNameSubmit = () => {
    if (customerName.trim()) {
      setNameEntered(true);
    }
  };

  // Poll for session updates (handoff acceptance, support messages)
  useEffect(() => {
    if (!isOpen || !sessionId) return;

    const pollSession = async () => {
      try {
        const response = await fetch(`/api/chat/session/${sessionId}`);
        if (response.ok) {
          const session = await response.json();
          console.log('Polling session:', { 
            needsHuman: session.needsHuman, 
            takenOver: session.takenOver,
            handoffRequested: session.handoffRequested,
            messagesCount: session.messages?.length 
          });
          
          // Check if handoff was accepted by admin (needsHuman = true means admin accepted)
          if (session.needsHuman && !handoffAccepted) {
            console.log('Handoff accepted by admin!');
            setHandoffAccepted(true);
            // Add a message that handoff is accepted
            setMessages(prev => {
              if (prev.find(m => m.id === "handoff-accepted")) return prev;
              return [...prev, {
                id: "handoff-accepted",
                sender: "bot",
                message: "✅ Great! A plumbing expert is now connected and will respond to you shortly!",
                timestamp: new Date(),
              }];
            });
          }
          
          // Check if support has taken over (sent first message)
          if (session.takenOver && !takenOver) {
            console.log('Support has taken over!');
            setTakenOver(true);
          }
          
          // Check if conversation is finished
          if (session.finished && !conversationFinished) {
            console.log('Conversation finished by admin');
            setConversationFinished(true);
            // Add a message that conversation is finished
            setMessages(prev => {
              if (prev.find(m => m.id === "conversation-finished")) return prev;
              return [...prev, {
                id: "conversation-finished",
                sender: "bot",
                message: "📋 This conversation has been ended. Thank you for contacting Climate Tech Plumbing! If you need further assistance, feel free to start a new chat.",
                timestamp: new Date(),
              }];
            });
          }
          
          // Add support messages
          if (session.messages && Array.isArray(session.messages)) {
            const supportMessages = session.messages.filter(
              (m: { sender: string; id: string }) => m.sender === "support"
            );
            
            supportMessages.forEach((msg: { id: string; sender: string; message: string; createdAt: string }) => {
              setMessages(prev => {
                if (prev.find(m => m.id === msg.id)) return prev;
                console.log('New support message:', msg.message);
                return [...prev, {
                  id: msg.id,
                  sender: "support",
                  message: msg.message,
                  timestamp: new Date(msg.createdAt),
                }];
              });
            });
          }
        }
      } catch (error) {
        console.error("Error polling session:", error);
      }
    };

    // Poll immediately, then every 2 seconds
    pollSession();
    const interval = setInterval(pollSession, 2000);
    return () => clearInterval(interval);
  }, [isOpen, sessionId, handoffAccepted, takenOver]);

  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || isTyping) return;
    
    const message = inputValue.trim();
    
    // Add user message locally
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: "user",
      message,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Save user message to database
    if (sessionId) {
      try {
        await fetch("/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, message, sender: "user" }),
        });
      } catch (e) {
        console.error("Failed to save message:", e);
      }
    }

    // If handoff has been requested but not accepted, show waiting message
    if (handoffRequested && !handoffAccepted) {
      return;
    }

    // If taken over by human, just save message (human will respond)
    if (takenOver) {
      return;
    }

    // Call AI API
    setIsTyping(true);
    try {
      const response = await fetch("/api/chat/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userMessage: message,
          conversationHistory: messages.slice(-10).map(m => ({
            sender: m.sender === "user" ? "user" : "bot",
            message: m.message
          })),
          handoffRequested
        }),
      });

      const data = await response.json();
      
      // If AI is disabled due to handoff
      if (data.aiDisabled) {
        setIsTyping(false);
        return;
      }

      const botMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: "bot",
        message: data.response || "I'm here to help! How can I assist you with your plumbing needs?",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);

      // Save bot message to database
      if (sessionId) {
        try {
          await fetch("/api/chat/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, message: botMessage.message, sender: "bot" }),
          });
        } catch (e) {
          console.error("Failed to save bot message:", e);
        }
      }

      // Check if needs human handoff
      if (data.needsHuman && !handoffRequested) {
        setHandoffRequested(true);
        
        // Mark session as requesting handoff
        if (sessionId) {
          await fetch(`/api/chat/session/${sessionId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ handoffRequested: true }),
          });
          
          // Send SMS notification to admin via notifications endpoint
          try {
            await fetch("/api/notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                type: "chat_handoff",
                data: {
                  customerName: customerName || "Guest",
                  sessionId: sessionId
                }
              }),
            });
          } catch (smsError) {
            console.error("Failed to send notification:", smsError);
          }
        }
        
        // Show waiting message
        setTimeout(() => {
          const waitingMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            sender: "bot",
            message: "Please wait a moment as we patch you to someone... ⏳",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, waitingMessage]);
        }, 500);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        sender: "bot",
        message: "I'm having trouble connecting right now. Please call us at 0720 219802 for immediate help! We're available 24/7.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping, messages, sessionId, handoffRequested, handoffAccepted, takenOver, customerName]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!nameEntered) {
        handleNameSubmit();
      } else {
        sendMessage();
      }
    }
  };

  const getHeaderText = () => {
    if (takenOver) return "Plumber Support";
    if (handoffAccepted) return "Connecting to Expert...";
    if (handoffRequested) return "Requesting Human...";
    return "AI Assistant";
  };

  const getHeaderStatus = () => {
    if (takenOver) return "Expert online";
    if (handoffAccepted) return "Expert connecting...";
    if (handoffRequested) return "Waiting for admin...";
    return "AI online";
  };

  // Reset state when chat is closed
  useEffect(() => {
    if (!isOpen) {
      setCustomerName("");
      setNameEntered(false);
      setMessages([WELCOME_MESSAGE]);
      setInputValue("");
      setIsTyping(false);
      setHandoffRequested(false);
      setHandoffAccepted(false);
      setTakenOver(false);
      setSessionId(null);
      setIsMinimized(false);
    }
  }, [isOpen]);

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-32 right-4 z-50"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-16 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-xl relative group"
            >
              <MessageCircle className="h-7 w-7" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
              <span className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-gray-900 text-white text-sm py-1 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                Chat with us!
              </span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "500px"
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-32 right-4 w-[350px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className={`p-4 transition-colors duration-500 flex-shrink-0 ${takenOver || handoffAccepted ? 'bg-gradient-to-r from-purple-500 to-purple-600' : handoffRequested ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-600'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                    animate={{ scale: handoffRequested || takenOver ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {takenOver ? (
                      <HeadphonesIcon className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {getHeaderText()}
                    </h3>
                    <div className="flex items-center gap-1">
                      <motion.span 
                        className={`w-2 h-2 rounded-full ${handoffRequested && !handoffAccepted ? 'bg-amber-300' : 'bg-green-300'}`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                      <span className="text-xs text-white/80">
                        {getHeaderStatus()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            {!isMinimized && (
              <>
                {/* Name Input Screen */}
                {!nameEntered ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
                    >
                      <User className="h-8 w-8 text-emerald-600" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome!</h3>
                    <p className="text-sm text-gray-500 mb-4 text-center">Please enter your name to start chatting</p>
                    <div className="w-full space-y-3">
                      <Input
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Your name"
                        className="text-center"
                        autoFocus
                      />
                      <Button
                        onClick={handleNameSubmit}
                        disabled={!customerName.trim()}
                        className="w-full bg-emerald-500 hover:bg-emerald-600"
                      >
                        Start Chat
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Messages */}
                    <div 
                      ref={messagesContainerRef}
                      className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
                      style={{ minHeight: "200px" }}
                    >
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                              msg.sender === "user"
                                ? "bg-emerald-500 text-white rounded-br-sm"
                                : msg.sender === "support"
                                ? "bg-purple-500 text-white rounded-bl-sm"
                                : "bg-white text-gray-800 rounded-bl-sm shadow border"
                            }`}
                          >
                            {msg.sender !== "user" && (
                              <p className={`text-xs mb-1 font-medium ${
                                msg.sender === "support" ? "text-purple-200" : "text-emerald-600"
                              }`}>
                                {msg.sender === "bot" ? (
                                  <span className="flex items-center gap-1">
                                    <Bot className="h-3 w-3" /> AI Assistant
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <HeadphonesIcon className="h-3 w-3" /> Plumber
                                  </span>
                                )}
                              </p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender === "user" 
                                ? "text-white/70" 
                                : msg.sender === "support"
                                ? "text-purple-200"
                                : "text-gray-400"
                            }`}>
                              {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      
                      {isTyping && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="bg-white rounded-2xl px-4 py-3 shadow border">
                            <p className="text-xs mb-1 font-medium text-emerald-600 flex items-center gap-1">
                              <Bot className="h-3 w-3" /> AI Assistant
                            </p>
                            <div className="flex items-center gap-1">
                              <motion.span 
                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                              />
                              <motion.span 
                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }}
                              />
                              <motion.span 
                                className="w-2 h-2 bg-emerald-400 rounded-full"
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {handoffRequested && !handoffAccepted && !takenOver && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-center"
                        >
                          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Connecting you to a plumbing expert...
                          </div>
                        </motion.div>
                      )}
                      
                      {handoffAccepted && !takenOver && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-center"
                        >
                          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full text-sm">
                            <HeadphonesIcon className="h-4 w-4" />
                            Expert connected! They will respond shortly.
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t flex-shrink-0">
                      {conversationFinished ? (
                        <div className="text-center py-2">
                          <p className="text-sm text-gray-500">✅ This conversation has ended. Refresh the page to start a new chat.</p>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={takenOver ? "Message the plumber..." : "Type your message..."}
                            className="flex-1 text-gray-800"
                            disabled={isTyping}
                          />
                          <Button
                            onClick={sendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            className={takenOver ? "bg-purple-500 hover:bg-purple-600" : "bg-emerald-500 hover:bg-emerald-600"}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
