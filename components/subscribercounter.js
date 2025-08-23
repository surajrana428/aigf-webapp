import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SubscriberCounter() {
  const [count, setCount] = useState(1247);

  useEffect(() => {
    // Update counter every 3-5 seconds for FOMO effect
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-4 bg-dark-card/80 backdrop-blur-xl border border-dark-border/50 rounded-full px-6 py-3 text-white font-semibold shadow-xl"
      animate={{ 
        scale: [1, 1.01, 1],
        boxShadow: [
          "0 8px 32px rgba(0,0,0,0.3)",
          "0 12px 40px rgba(59, 130, 246, 0.2)",
          "0 8px 32px rgba(0,0,0,0.3)"
        ]
      }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      {/* Online indicator */}
      <motion.div
        className="w-3 h-3 bg-green-online rounded-full shadow-lg"
        animate={{ 
          scale: [1, 1.2, 1],
          boxShadow: [
            "0 0 8px rgba(16, 185, 129, 0.6)",
            "0 0 16px rgba(16, 185, 129, 0.8)",
            "0 0 8px rgba(16, 185, 129, 0.6)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Counter text */}
      <motion.span
        key={count} // This triggers animation on count change
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-base font-medium"
      >
        {count.toLocaleString()} users online now
      </motion.span>

      {/* Heart emoji */}
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-lg"
      >
        💙
      </motion.div>

      {/* Live badge */}
      <div className="flex items-center gap-2 bg-green-online/20 border border-green-online/30 rounded-full px-3 py-1">
        <motion.div
          className="w-2 h-2 bg-green-online rounded-full"
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="text-green-accent text-sm font-semibold">Live</span>
      </div>
    </motion.div>
  );
}
