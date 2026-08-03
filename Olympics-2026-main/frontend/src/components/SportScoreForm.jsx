import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { getConfig } from '../utils/scoreFormConfigs';

// ── individual field input ────────────────────────────────────────────────────
function FieldInput({ field, value, onChange }) {
  if (field.type === 'boolean') {
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`w-full py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 ${
          value
            ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
            : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
        }`}
      >
        {value ? '✓ Yes' : '— No'}
      </button>
    );
  }

  if (field.type === 'select') {
    return (
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
      >
        <option value="" className="bg-dark-800 text-gray-400">Select…</option>
        {field.options?.map((o) => (
          <option key={o.value ?? o} value={o.value ?? o} className="bg-dark-800">
            {o.label ?? o}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="number"
      step={field.type === 'decimal' ? '0.01' : '1'}
      min={field.min ?? 0}
      max={field.max}
      value={value ?? ''}
      placeholder={field.placeholder}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '' || raw === '-') { onChange(undefined); return; }
        onChange(field.type === 'decimal' ? parseFloat(raw) : parseInt(raw, 10));
      }}
      className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
    />
  );
}

// ── main component ─────────────────────────────────────────────────────────────
export default function SportScoreForm({ scoreType, onSubmit, disabled }) {
  const config = getConfig(scoreType);
  const [details, setDetails] = useState({});

  const set = (key, val) => setDetails((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Sport / type info badge */}
      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10">
        <span className="text-2xl">{config.icon}</span>
        <div>
          <p className="text-white font-semibold text-sm leading-none">{config.title}</p>
          <p className="text-gray-500 text-xs mt-0.5">{config.description}</p>
        </div>
      </div>

      {/* Extra fields (toss, KO flag, etc.) */}
      {config.extraFields?.length > 0 && (
        <div className={`grid gap-3 ${config.extraFields.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {config.extraFields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                {field.label}
                {field.hint && <span className="ml-1 text-gray-600 font-normal">({field.hint})</span>}
              </label>
              <FieldInput field={field} value={details[field.key]} onChange={(v) => set(field.key, v)} />
            </div>
          ))}
        </div>
      )}

      {/* Two-column: Your Score | Opponent */}
      <div className="grid grid-cols-2 gap-4">

        {/* Player */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
            <span className="text-sm font-bold text-white">Your Score</span>
          </div>
          {config.playerFields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs text-gray-400 mb-1">
                {field.label}
                {field.hint && <span className="ml-1 text-gray-600 font-normal">({field.hint})</span>}
              </label>
              <FieldInput field={field} value={details[field.key]} onChange={(v) => set(field.key, v)} />
            </div>
          ))}
        </div>

        {/* Opponent */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
            <span className="text-sm font-bold text-white">Opponent</span>
          </div>
          {config.opponentFields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs text-gray-400 mb-1">{field.label}</label>
              <FieldInput field={field} value={details[field.key]} onChange={(v) => set(field.key, v)} />
            </div>
          ))}
        </div>
      </div>

      {/* Live score preview */}
      <div className="flex items-center justify-center gap-4 py-3 rounded-xl bg-white/5 border border-white/10">
        <span className="font-display font-black text-2xl text-primary-400 min-w-[60px] text-right">
          {config.getPlayerDisplay(details)}
        </span>
        <span className="font-display font-bold text-gray-600 text-lg">VS</span>
        <span className="font-display font-black text-2xl text-red-400 min-w-[60px] text-left">
          {config.getOpponentDisplay(details)}
        </span>
      </div>

      <motion.button
        type="submit"
        disabled={disabled}
        whileTap={{ scale: 0.97 }}
        whileHover={disabled ? {} : { scale: 1.01 }}
        className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-display font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {disabled ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <><Trophy className="w-5 h-5" /> Submit Match Result</>
        )}
      </motion.button>
    </form>
  );
}
