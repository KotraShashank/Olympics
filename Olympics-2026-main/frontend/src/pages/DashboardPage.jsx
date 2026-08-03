import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { performanceAPI } from '../api/performanceAPI';
import { matchAPI } from '../api/matchAPI';
import Loader from '../components/Loader';
import LevelBadge from '../components/LevelBadge';
import StatCard from '../components/StatCard';
import { Trophy, Zap, Activity, Star, ChevronRight, Target } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_ICONS, LEVEL_CONFIG } from '../utils/constants';

const JOURNEY_STEPS = [
  { key: 'LEVEL_1', label: 'Level 1', icon: '🥉' },
  { key: 'LEVEL_2', label: 'Level 2', icon: '⚡' },
  { key: 'LEVEL_3', label: 'Level 3', icon: '🔥' },
  { key: 'LEVEL_4', label: 'Level 4', icon: '💥' },
  { key: 'LEVEL_5', label: 'Level 5', icon: '⚔️' },
  { key: 'DISTRICT', label: 'District', icon: '🏅' },
  { key: 'STATE', label: 'State', icon: '🥈' },
  { key: 'OLYMPICS', label: 'Olympics', icon: '🥇' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progressList, setProgressList] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([performanceAPI.getAllProgress(), matchAPI.getRecent()])
      .then(([pRes, mRes]) => {
        setProgressList(pRes.data.data || []);
        setRecentMatches((mRes.data.data || []).slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalWins = progressList.reduce((s, p) => s + p.totalWins, 0);
  const totalMatches = progressList.reduce((s, p) => s + p.totalMatches, 0);
  const olympicCount = progressList.filter((p) => p.qualifiedForOlympics).length;
  const highestLevel = progressList.reduce((max, p) => {
    const o = LEVEL_CONFIG[p.currentLevel]?.order || 0;
    return o > max ? o : max;
  }, 0);

  if (loading) return <div className="pt-20"><Loader text="Loading your stats..." /></div>;

  return (
    <div className="min-h-screen bg-hero-gradient pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/30 to-orange-500/30 border border-gold/30 flex items-center justify-center text-2xl">
              🏃
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">
                Welcome, <span className="bg-gradient-to-r from-gold to-orange-400 bg-clip-text text-transparent">{user?.username}</span>!
              </h1>
              <p className="text-gray-400 text-sm">Your Olympic journey dashboard</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="⚽" label="Sports Active" value={progressList.length} delay={0} />
          <StatCard icon="🏆" label="Total Wins" value={totalWins} color="text-green-400" delay={0.1} />
          <StatCard icon="⚔️" label="Total Matches" value={totalMatches} color="text-primary-400" delay={0.2} />
          <StatCard icon="🥇" label="Olympic Qualifications" value={olympicCount} color="text-gold" delay={0.3} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Active Sports */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-white text-xl flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-400" /> Active Sports
              </h2>
              <button onClick={() => navigate('/sports')} className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                Browse all <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {progressList.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-dark-700/60 border border-white/10 rounded-2xl p-10 text-center"
              >
                <span className="text-5xl block mb-3">🏅</span>
                <h3 className="font-display text-xl font-bold text-white mb-2">No Sports Yet</h3>
                <p className="text-gray-400 mb-4">Pick a sport and start your Olympic journey!</p>
                <button
                  onClick={() => navigate('/sports')}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold text-sm hover:from-primary-500 hover:to-purple-500 transition-all"
                >
                  Choose a Sport
                </button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {progressList.map((p, i) => {
                  const gradient = CATEGORY_COLORS['TEAM'] || 'from-gray-600 to-gray-800';
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => navigate(`/sports/${p.sportId}/match`)}
                      className="bg-dark-700/80 border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-white/25 hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl flex-shrink-0">🏆</div>
                          <div className="min-w-0">
                            <p className="font-display font-bold text-white text-sm truncate">{p.sportName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <LevelBadge level={p.currentLevel} size="sm" />
                              <span className="text-xs text-gray-500">{p.totalWins}W {p.totalLosses}L</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="font-display font-bold text-primary-400">{p.winRate}%</p>
                          <p className="text-xs text-gray-500">win rate</p>
                        </div>
                      </div>
                      {/* Mini progress */}
                      <div className="mt-3">
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${p.matchesPlayedInLevel && p.matchesRemainingInLevel !== undefined ? Math.min(((p.matchesPlayedInLevel) / (p.matchesPlayedInLevel + p.matchesRemainingInLevel)) * 100, 100) : 0}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Journey Tracker */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-dark-700/80 border border-white/10 rounded-2xl p-5"
            >
              <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-gold" /> Olympic Path
              </h2>
              <div className="space-y-2">
                {JOURNEY_STEPS.map((step, i) => {
                  const isReached = progressList.some((p) => {
                    const o = LEVEL_CONFIG[p.currentLevel]?.order || 0;
                    return o >= (i + 1);
                  });
                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all ${
                        isReached ? 'bg-gradient-to-br from-gold/40 to-orange-500/40 border border-gold/50' : 'bg-white/5 border border-white/10'
                      }`}>
                        {step.icon}
                      </div>
                      <span className={`text-sm font-medium ${isReached ? 'text-white' : 'text-gray-600'}`}>{step.label}</span>
                      {isReached && <span className="ml-auto text-xs text-gold">✓</span>}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Recent Matches */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-dark-700/80 border border-white/10 rounded-2xl p-5"
            >
              <h2 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary-400" /> Recent Matches
              </h2>
              {recentMatches.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No matches yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentMatches.map((m) => {
                    const icons = { WIN: '🏆', LOSS: '💔', DRAW: '🤝' };
                    const colors = { WIN: 'text-green-400', LOSS: 'text-red-400', DRAW: 'text-yellow-400' };
                    return (
                      <div key={m.id} className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <span>{icons[m.result]}</span>
                          <div>
                            <p className="text-xs font-medium text-white truncate max-w-[100px]">{m.sportName}</p>
                            <p className="text-xs text-gray-500">{m.level?.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <span className={`font-display font-bold text-sm ${colors[m.result]}`}>
                          {m.playerScore}–{m.opponentScore}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
