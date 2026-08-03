import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { performanceAPI } from '../api/performanceAPI';
import Loader from '../components/Loader';
import LevelBadge from '../components/LevelBadge';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { ArrowLeft, Trophy, TrendingUp } from 'lucide-react';

export default function PerformancePage() {
  const { sportId } = useParams();
  const navigate = useNavigate();
  const [summaries, setSummaries] = useState([]);
  const [progress, setProgress] = useState(null);
  const [allProgress, setAllProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sportId) {
      Promise.all([
        performanceAPI.getSummaryBySport(sportId),
        performanceAPI.getProgressBySport(sportId),
      ]).then(([sRes, pRes]) => {
        setSummaries(sRes.data.data || []);
        setProgress(pRes.data.data);
      }).catch(() => {}).finally(() => setLoading(false));
    } else {
      Promise.all([
        performanceAPI.getAllSummaries(),
        performanceAPI.getAllProgress(),
      ]).then(([sRes, pRes]) => {
        setSummaries(sRes.data.data || []);
        setAllProgress(pRes.data.data || []);
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [sportId]);

  if (loading) return <div className="pt-20"><Loader text="Loading performance data..." /></div>;

  const barData = summaries.map((s) => ({
    level: s.level.replace('_', ' '),
    wins: s.wins,
    losses: s.losses,
    draws: s.draws,
    winPct: parseFloat(s.winPercentage?.toFixed(1) || 0),
  }));

  const radarData = summaries.map((s) => ({
    level: s.level.replace('_', ' '),
    winPct: parseFloat(s.winPercentage?.toFixed(1) || 0),
  }));

  const customTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-dark-800 border border-white/20 rounded-xl p-3 text-sm shadow-xl">
        <p className="font-display font-bold text-white mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-hero-gradient pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </button>
          <div>
            <h1 className="font-display text-3xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-primary-400" />
              {sportId ? 'Sport Performance' : 'All Performance'}
            </h1>
            {progress && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-400 text-sm">{progress.sportName}</span>
                <LevelBadge level={progress.currentLevel} size="sm" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Overall stats row */}
        {progress && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '⚔️', label: 'Total Matches', val: progress.totalMatches, color: 'text-white' },
              { icon: '🏆', label: 'Total Wins', val: progress.totalWins, color: 'text-green-400' },
              { icon: '💔', label: 'Total Losses', val: progress.totalLosses, color: 'text-red-400' },
              { icon: '📊', label: 'Win Rate', val: `${progress.winRate}%`, color: 'text-primary-400' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-dark-700/80 border border-white/10 rounded-2xl p-4 text-center"
              >
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className={`font-display text-2xl font-bold ${s.color}`}>{s.val}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </motion.div>
            ))}
          </div>
        )}

        {summaries.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl">📊</span>
            <p className="text-gray-400 mt-3 text-lg">No performance data yet. Play some matches!</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-dark-700/80 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="font-display font-bold text-white mb-4">Wins / Losses by Level</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="level" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Tooltip content={customTooltip} />
                  <Bar dataKey="wins" fill="#22c55e" radius={[4, 4, 0, 0]} name="Wins" />
                  <Bar dataKey="losses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Losses" />
                  <Bar dataKey="draws" fill="#eab308" radius={[4, 4, 0, 0]} name="Draws" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Radar chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-dark-700/80 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="font-display font-bold text-white mb-4">Win % by Level</h2>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="level" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 9 }} />
                  <Radar name="Win %" dataKey="winPct" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Level-by-level summary table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-dark-700/80 border border-white/10 rounded-2xl p-6"
            >
              <h2 className="font-display font-bold text-white mb-4">Level-by-Level Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase border-b border-white/10">
                      <th className="text-left pb-3">Level</th>
                      <th className="text-center pb-3">Played</th>
                      <th className="text-center pb-3">Wins</th>
                      <th className="text-center pb-3">Losses</th>
                      <th className="text-center pb-3">Draws</th>
                      <th className="text-center pb-3">Win %</th>
                      <th className="text-center pb-3">Advanced</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {summaries.map((s) => (
                      <tr key={s.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3">
                          <LevelBadge level={s.level} size="sm" />
                        </td>
                        <td className="text-center text-gray-300 py-3">{s.matchesPlayed}</td>
                        <td className="text-center text-green-400 font-semibold py-3">{s.wins}</td>
                        <td className="text-center text-red-400 py-3">{s.losses}</td>
                        <td className="text-center text-yellow-400 py-3">{s.draws}</td>
                        <td className="text-center py-3">
                          <span className={`font-display font-bold ${(s.winPercentage || 0) >= 60 ? 'text-green-400' : (s.winPercentage || 0) >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {(s.winPercentage || 0).toFixed(1)}%
                          </span>
                        </td>
                        <td className="text-center py-3">
                          {s.advancedToNextLevel
                            ? <span className="text-green-400">✓</span>
                            : <span className="text-gray-600">—</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
