import { motion } from 'framer-motion';
import { useState } from 'react';

export default function GirlCard({ girl, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getEmoji = (girlId) => {
    const emojis = {
      angela: '💫',
      aria: '🎮',
      elisa: '☕',
      emily: '🌟'
    };
    return emojis[girl.id] || '✨';
  };

  return (
    <motion.div
      className="relative bg-dark-card/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-dark-border/50 shadow-2xl cursor-pointer group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        boxShadow: "0 25px 50px rgba(59, 130, 246, 0.15)"
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      style={{ height: '500px' }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Image Container */}
      <div className="relative h-[70%] overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 loading-skeleton" />
        )}

        <motion.img
          src={girl.image}
          alt={girl.name}
          className="w-full h-full object-cover transition-all duration-700"
          animate={isHovered ? { scale: 1.08 } : { scale: 1 }}
          onLoad={() => setImageLoaded(true)}
          style={{ opacity: imageLoaded ? 1 : 0 }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-60" />

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-blue-500/20 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-bg/95 via-dark-bg/80 to-transparent p-6">
        {/* Header with name and age */}
        <div className="flex items-center justify-between mb-3">
          <motion.h3
            className="text-2xl font-bold text-white"
            animate={isHovered ? { color: '#60a5fa' } : { color: '#ffffff' }}
            transition={{ duration: 0.3 }}
          >
            {girl.name}
          </motion.h3>

          <div className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-online rounded-full animate-pulse" />
            <span className="text-blue-accent font-semibold text-sm">{girl.age}</span>
          </div>
        </div>

        {/* Description */}
        <motion.p
          className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed"
          animate={isHovered ? { y: -2 } : { y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {girl.description}
        </motion.p>

        {/* Traits */}
        <div className="flex flex-wrap gap-2 mb-4">
          {girl.traits.map((trait, index) => (
            <motion.span
              key={trait}
              className="px-3 py-1 bg-green-online/20 border border-green-online/30 text-green-accent text-xs rounded-full font-medium"
              animate={isHovered ? { scale: 1.05, y: -1 } : { scale: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              {trait}
            </motion.span>
          ))}
        </div>

        {/* CTA Button */}
        <motion.button
          className="w-full bg-blue-gradient text-white font-bold py-3 px-6 rounded-xl text-base transition-all duration-300 shadow-lg relative overflow-hidden group"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            className="relative z-10 flex items-center justify-center gap-2"
            animate={isHovered ? { y: -1 } : { y: 0 }}
          >
            Start Chat
            <motion.span
              animate={isHovered ? { scale: [1, 1.2, 1], rotate: [0, 15, 0] } : {}}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
            >
              {getEmoji(girl.id)}
            </motion.span>
          </motion.span>

          {/* Button shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%', skew: '45deg' }}
            animate={isHovered ? { x: '100%' } : { x: '-100%' }}
            transition={{ duration: 0.8 }}
          />
        </motion.button>
      </div>

      {/* Floating decorations */}
      <motion.div
        className="absolute top-4 right-4 text-2xl"
        animate={isHovered ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        } : {}}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      >
        ✨
      </motion.div>

      {/* Card glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={isHovered ? {
          boxShadow: "inset 0 0 0 1px rgba(59, 130, 246, 0.3)"
        } : {
          boxShadow: "inset 0 0 0 1px transparent"
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
                                }
