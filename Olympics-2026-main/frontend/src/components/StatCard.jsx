import { motion } from 'framer-motion';

export default function StatCard({ icon, label, value, color = 'text-primary-400', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all duration-300 hover:border-white/20 group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-body mb-1">{label}</p>
          <p className={`text-3xl font-display font-bold ${color}`}>{value}</p>
        </div>
        <span className="text-3xl group-hover:animate-bounce">{icon}</span>
      </div>
    </motion.div>
  );
}
