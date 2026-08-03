import { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJIS = ['🏆', '⭐', '🥇', '✨', '🎉', '🔥', '🌟', '💫'];

function Particle({ index }) {
  const style = useMemo(() => ({
    left:  `${Math.random() * 100}%`,
    top:   `${Math.random() * 100}%`,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [index]);

  const emoji  = EMOJIS[index % EMOJIS.length];
  const xDrift = (Math.random() - 0.5) * 260;
  const delay  = Math.random() * 1.2;

  return (
    <motion.div
      className="absolute text-xl select-none pointer-events-none"
      style={style}
      initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0, 1.2, 1, 0.4], y: -340, x: xDrift }}
      transition={{ duration: 2.5 + Math.random() * 1.5, delay, ease: 'easeOut' }}
    >
      {emoji}
    </motion.div>
  );
}

export default function WinCelebration({ show, onClose, sportName }) {
  // auto-dismiss after 7 s
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="win-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          onClick={onClose}
        >
          {/* blurred backdrop */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

          {/* floating particles */}
          {Array.from({ length: 32 }, (_, i) => <Particle key={i} index={i} />)}

          {/* main card */}
          <motion.div
            initial={{ scale: 0.25, rotate: -8, opacity: 0 }}
            animate={{ scale: 1,    rotate: 0,  opacity: 1 }}
            exit={{   scale: 0.25, rotate:  8,  opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.05 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 bg-dark-800 border-2 border-yellow-500/60 rounded-3xl px-10 py-10 text-center max-w-sm w-full mx-4"
            style={{
              boxShadow:
                '0 0 40px rgba(255,215,0,0.35), 0 0 90px rgba(255,165,0,0.18), inset 0 0 60px rgba(255,215,0,0.04)',
            }}
          >
            {/* floating trophy */}
            <motion.div
              animate={{ y: [-8, 8, -8], rotate: [-4, 4, -4] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl mb-4 leading-none"
            >
              🏆
            </motion.div>

            {/* VICTORY! */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1,  y: 0  }}
              transition={{ delay: 0.3 }}
              className="font-display text-5xl font-black tracking-widest mb-1"
              style={{
                background: 'linear-gradient(135deg, #ffd700, #ffe066, #ffa500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(255,215,0,0.4)',
              }}
            >
              VICTORY!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-300 text-base mb-6"
            >
              {sportName ? `You won the ${sportName} match!` : 'Excellent performance!'}
            </motion.p>

            {/* spinning stars */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.65, type: 'spring' }}
              className="flex justify-center gap-3 mb-7"
            >
              {[0, 0.15, 0.3].map((delay, i) => (
                <motion.span
                  key={i}
                  className="text-yellow-400 text-3xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, delay, repeat: Infinity, ease: 'linear' }}
                >
                  ⭐
                </motion.span>
              ))}
            </motion.div>

            {/* continue button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.85 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-display font-bold text-dark-900 text-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, #ffd700, #ffa500)',
                boxShadow: '0 4px 20px rgba(255,165,0,0.4)',
              }}
            >
              Continue 🚀
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
