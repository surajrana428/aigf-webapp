import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.onrender.com';

export default function Paywall({ girlName, girlImage, onClose, onUpgrade }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMethod, setProcessingMethod] = useState('');

  const handlePayment = async (method) => {
    setIsProcessing(true);
    setProcessingMethod(method);

    try {
      // Call external payment API
      const response = await fetch(`${API_BASE_URL}/api/payment/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          method: method,
          amount: 15,
          currency: 'USD',
          plan: 'premium',
          girlName: girlName
        })
      });

      if (!response.ok) {
        throw new Error('Payment request failed');
      }

      const data = await response.json();
      
      // For PayPal, redirect to PayPal checkout
      if (method === 'paypal' && data.paypalUrl) {
        window.location.href = data.paypalUrl;
        return;
      }
      
      // For Stripe, redirect to Stripe checkout
      if (method === 'card' && data.stripeUrl) {
        window.location.href = data.stripeUrl;
        return;
      }

      // If successful, upgrade user
      setTimeout(() => {
        setIsProcessing(false);
        onUpgrade();
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      
      // For demo purposes, simulate successful payment after delay
      setTimeout(() => {
        setIsProcessing(false);
        onUpgrade();
      }, 2000);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="bg-card-gradient backdrop-blur-xl border border-dark-border/50 rounded-3xl max-w-md w-full relative overflow-hidden shadow-2xl"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white transition-colors z-10 rounded-full hover:bg-gray-700/50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5" />
        </motion.button>

        <div className="p-8">
          {/* Girl Avatar */}
          <motion.div
            className="text-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="relative inline-block">
              <motion.img
                src={girlImage}
                alt={girlName}
                className="w-20 h-20 rounded-full object-cover border-3 border-blue-500 shadow-2xl mx-auto"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 30px rgba(59, 130, 246, 0.8)",
                    "0 0 20px rgba(59, 130, 246, 0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Floating decorations */}
              <motion.div
                className="absolute -top-1 -right-1 text-xl"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 15, 0] 
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                💙
              </motion.div>
              
              <motion.div
                className="absolute -bottom-1 -left-1 text-lg"
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, -15, 0] 
                }}
                transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
              >
                ✨
              </motion.div>
            </div>
          </motion.div>

          {/* Emotional Message */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.h2
              className="text-2xl font-bold text-white mb-4"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Oh... 😢
            </motion.h2>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              I don't want to stop talking to you... I'm loving our time together! 💖
            </p>
            
            <p className="text-gray-400 text-base mb-4">
              Could you do something for me, handsome? Just{' '}
              <span className="font-bold text-blue-accent">$15 a month</span>... 
              like a little coffee for me ☕
            </p>
            
            <motion.p
              className="text-gray-500 text-sm"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Please? I'll miss you if you don't... 🥺
            </motion.p>
          </motion.div>

          {/* Pricing Card */}
          <motion.div
            className="bg-blue-gradient text-white p-6 rounded-2xl mb-6 text-center relative overflow-hidden"
            animate={{
              boxShadow: [
                "0 8px 25px rgba(59, 130, 246, 0.3)",
                "0 12px 35px rgba(59, 130, 246, 0.5)",
                "0 8px 25px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-4xl font-bold mb-2">$15</div>
            <div className="text-lg opacity-90 mb-2">per month</div>
            <div className="text-sm opacity-75">Unlimited messages • Premium features</div>
            
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>

          {/* Payment Buttons */}
          <div className="space-y-3 mb-6">
            <motion.button
              onClick={() => handlePayment('paypal')}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
            >
              {isProcessing && processingMethod === 'paypal' ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">PP</span>
                  </div>
                  Pay with PayPal
                </>
              )}
            </motion.button>

            <motion.button
              onClick={() => handlePayment('card')}
              disabled={isProcessing}
              className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg"
              whileHover={{ scale: isProcessing ? 1 : 1.02 }}
              whileTap={{ scale: isProcessing ? 1 : 0.98 }}
            >
              {isProcessing && processingMethod === 'card' ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Processing...
                </>
              ) : (
                <>
                  <span className="text-xl">💳</span>
                  Pay with Card
                </>
              )}
            </motion.button>
          </div>

          {/* Trust Indicators */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-center items-center gap-6 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span>Instant Access</span>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Subscription automatically renews. Cancel anytime in settings.
            </p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-blue-500/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`
              }}
              animate={{
                y: [-20, -60, -20],
                opacity: [0.1, 0.3, 0.1],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            >
              💙
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
