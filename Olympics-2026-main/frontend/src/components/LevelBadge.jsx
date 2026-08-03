import { motion } from 'framer-motion';
import { LEVEL_CONFIG } from '../utils/constants';

export default function LevelBadge({ level, size = 'md' }) {
  const config = LEVEL_CONFIG[level] || { label: level, color: 'from-gray-500 to-gray-700', icon: '🎮' };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1.5 rounded-full font-display font-semibold text-white bg-gradient-to-r ${config.color} shadow-lg ${sizes[size]}`}
    >
      <span>{config.icon}</span>
      {config.label}
    </motion.span>
  );
}
