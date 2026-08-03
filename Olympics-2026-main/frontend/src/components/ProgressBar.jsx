import { motion } from 'framer-motion';

export default function ProgressBar({ value, max, color = 'bg-primary-500', showLabel = true, label }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>{label || 'Progress'}</span>
          <span className="font-semibold text-white">{value} / {max}</span>
        </div>
      )}
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${color} relative`}
        >
          {pct > 10 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
