import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Paywall from '../components/Paywall';

const TRIAL_LIMIT = 10;
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.onrender.com';

export default function ChatPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Get user data from localStorage
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('userData');
      if (!data) {
        router.push('/');
        return;
      }
      
      const parsedData = JSON.parse(data);
      if (!parsedData.onboardingComplete) {
        router.push('/');
        return;
      }
      
      setUserData(parsedData);
      
      // Check premium status and message count
      const premium = localStorage.getItem('isPremium') === 'true';
      const count = parseInt(localStorage.getItem('messageCount') || '0');
      setIsPremium(premium);
      setMessageCount(count);

      // Add initial greeting
      setTimeout(() => {
        addMessage(
          `Hey ${parsedData.userName}! ✨ I'm so excited to chat with you! How's your day going?`,
          'ai'
        );
      }, 1000);
    }
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (text, sender) => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const showTypingIndicator = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  // Replace API call with external backend
  const getAIResponse = async (userMessage) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userData: userData,
          girlName: userData?.girlName || userData?.selectedGirl?.name
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Fallback responses if API fails
      const fallbackResponses = [
        `That's really interesting, ${userData?.userName}! ✨ Tell me more about that!`,
        `You always have such great thoughts! 😊 I love our conversations!`,
        `Wow, ${userData?.userName}! You're so thoughtful 💫 What else is on your mind?`,
        `I could talk with you for hours about this! 🌟 Keep going!`,
        `You make me so happy when you share things with me! ✨`,
        `That's amazing! You're such an interesting person, ${userData?.userName} 💙`
      ];
      
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    // Check trial limit for non-premium users
    if (!isPremium && messageCount >= TRIAL_LIMIT) {
      setShowPaywall(true);
      return;
    }

    // Add user message
    addMessage(inputMessage.trim(), 'user');
    const currentInput = inputMessage;
    setInputMessage('');

    // Update message count
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    if (typeof window !== 'undefined') {
      localStorage.setItem('messageCount', newCount.toString());
    }

    // Show AI typing and get response
    showTypingIndicator();
    
    try {
      const aiResponse = await getAIResponse(currentInput);
      setTimeout(() => {
        addMessage(aiResponse, 'ai');
      }, 1500 + Math.random() * 1000);
    } catch (error) {
      console.error('Error in chat:', error);
    }
  };

  const handlePremiumUpgrade = async () => {
    // Call external payment API
    try {
      const response = await fetch(`${API_BASE_URL}/api/payment/upgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData?.userId || 'anonymous',
          plan: 'premium'
        })
      });

      if (response.ok) {
        setIsPremium(true);
        setShowPaywall(false);
        if (typeof window !== 'undefined') {
          localStorage.setItem('isPremium', 'true');
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      // For demo purposes, still upgrade
      setIsPremium(true);
      setShowPaywall(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isPremium', 'true');
      }
    }
  };

  const handleBackToLanding = () => {
    if (typeof window !== 'undefined') {
      // Reset state
      localStorage.removeItem('userData');
      localStorage.removeItem('selectedGirl');
      localStorage.removeItem('messageCount');
      localStorage.removeItem('isPremium');
    }
    router.push('/');
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-dark-gradient flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const girlName = userData.girlName || userData.selectedGirl?.name;

  return (
    <>
      <Head>
        <title>Chat with {girlName} - AI Girlfriend</title>
        <meta name="description" content={`Chat with ${girlName}, your AI companion`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-dark-gradient flex flex-col">
        {/* Header */}
        <motion.header
          className="bg-dark-card/90 backdrop-blur-xl border-b border-dark-border/50 p-4 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <motion.button
              onClick={handleBackToLanding}
              className="p-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            
            <div className="flex items-center gap-4">
              <motion.img
                src={userData.selectedGirl.image}
                alt={girlName}
                className="w-12 h-12 rounded-full border-2 border-blue-500 object-cover shadow-lg"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(59, 130, 246, 0.5)",
                    "0 0 20px rgba(59, 130, 246, 0.8)",
                    "0 0 10px rgba(59, 130, 246, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="text-white">
                <h1 className="font-bold text-lg">{girlName}</h1>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>

            <div className="text-white text-sm text-center">
              {isPremium ? (
                <div className="flex items-center gap-2 text-green-400">
                  <span>⭐</span>
                  <span className="font-semibold">Premium</span>
                </div>
              ) : (
                <div>
                  <div className="text-xs text-gray-400">Free Messages</div>
                  <div className="font-bold text-lg">
                    <span className={messageCount >= TRIAL_LIMIT - 2 ? 'text-red-400' : 'text-white'}>
                      {messageCount}
                    </span>
                    /{TRIAL_LIMIT}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-transparent to-dark-bg/20">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-gradient text-white ml-auto rounded-br-sm'
                          : 'bg-dark-card/90 backdrop-blur-sm text-white border border-dark-border/30 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="bg-dark-card/90 backdrop-blur-sm border border-dark-border/30 px-6 py-4 rounded-2xl rounded-bl-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400 text-sm">{girlName} is typing</span>
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-blue-500 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <motion.div
          className="bg-dark-card/90 backdrop-blur-xl border-t border-dark-border/50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Message ${girlName}...`}
                  className="w-full p-4 pr-12 bg-gray-800/80 border border-gray-600/50 rounded-2xl focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 backdrop-blur-sm resize-none"
                  disabled={isTyping}
                />
                <motion.button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-gradient rounded-full text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            {/* Trial Warning */}
            {!isPremium && messageCount >= TRIAL_LIMIT - 3 && messageCount < TRIAL_LIMIT && (
              <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-yellow-400 text-sm font-medium">
                  ⚠️ Only {TRIAL_LIMIT - messageCount} messages left in your free trial
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Paywall Modal */}
        <AnimatePresence>
          {showPaywall && (
            <Paywall
              girlName={girlName}
              girlImage={userData.selectedGirl.image}
              onClose={() => setShowPaywall(false)}
              onUpgrade={handlePremiumUpgrade}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
} text-center">
              {isPremium ? (
                <div className="flex items-center gap-2 text-green-400">
                  <span>⭐</span>
                  <span className="font-semibold">Premium</span>
                </div>
              ) : (
                <div>
                  <div className="text-xs text-gray-400">Free Messages</div>
                  <div className="font-bold text-lg">
                    <span className={messageCount >= TRIAL_LIMIT - 2 ? 'text-red-400' : 'text-white'}>
                      {messageCount}
                    </span>
                    /{TRIAL_LIMIT}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-transparent to-dark-bg/20">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-gradient text-white ml-auto rounded-br-sm'
                          : 'bg-dark-card/90 backdrop-blur-sm text-white border border-dark-border/30 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="bg-dark-card/90 backdrop-blur-sm border border-dark-border/30 px-6 py-4 rounded-2xl rounded-bl-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400 text-sm">{girlName} is typing</span>
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-blue-500 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <motion.div
          className="bg-dark-card/90 backdrop-blur-xl border-t border-dark-border/50 p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-4 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Message ${girlName}...`}
                  className="w-full p-4 pr-12 bg-gray-800/80 border border-gray-600/50 rounded-2xl focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 backdrop-blur-sm resize-none"
                  disabled={isTyping}
                />
                <motion.button
                  onClick={handleSendMessage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-gradient rounded-full text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            {/* Trial Warning */}
            {!isPremium && messageCount >= TRIAL_LIMIT - 3 && messageCount < TRIAL_LIMIT && (
              <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-yellow-400 text-sm font-medium">
                  ⚠️ Only {TRIAL_LIMIT - messageCount} messages left in your free trial
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Paywall Modal */}
        <AnimatePresence>
          {showPaywall && (
            <Paywall
              girlName={girlName}
        
