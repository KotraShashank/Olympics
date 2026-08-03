import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sportsAPI } from '../api/sportsAPI';
import { matchAPI } from '../api/matchAPI';
import { performanceAPI } from '../api/performanceAPI';
import Loader from '../components/Loader';
import LevelBadge from '../components/LevelBadge';
import ProgressBar from '../components/ProgressBar';
import SportScoreForm from '../components/SportScoreForm';
import WinCelebration from '../components/WinCelebration';
import toast from 'react-hot-toast';
import { Trophy, Sword, ChevronRight, ArrowRight, Activity } from 'lucide-react';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/constants';
import { getConfig } from '../utils/scoreFormConfigs';

const RESULT_CONFIG = {
  WIN:  { label: 'Victory!',   icon: '🏆', color: 'text-green-400',  bg: 'bg-green-500/20 border-green-500/40' },
  LOSS: { label: 'Defeat',     icon: '💔', color: 'text-red-400',    bg: 'bg-red-500/20 border-red-500/40' },
  DRAW: { label: 'Draw',       icon: '🤝', color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/40' },
};

export default function MatchPage() {
  const { sportId } = useParams();
  const navigate = useNavigate();

  const [sport, setSport] = useState(null);
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const fetchData = async () => {
    try {
      const [sportRes, historyRes] = await Promise.all([
        sportsAPI.getById(sportId),
        matchAPI.getHistory(sportId),
      ]);
      setSport(sportRes.data.data);
      setHistory(historyRes.data.data || []);

      try {
        const progRes = await performanceAPI.getProgressBySport(sportId);
        setProgress(progRes.data.data);
      } catch (e) {
        if (e.response?.status !== 404) throw e;
        setProgress(null);
      }
    } catch {
      toast.error('Failed to load sport data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [sportId]);

  const handleSubmit = async (scoreDetails) => {
    setSubmitting(true);
    try {
     const res = await matchAPI.submit({ sportId, scoreDetails });
      const match = res.data.data;
      setLastResult(match);
      await fetchData();

      if (match.result === 'WIN') {
        setShowCelebration(true);
      } else {
        const cfg = RESULT_CONFIG[match.result];
        toast(cfg.label + ' ' + cfg.icon, { duration: 3000 });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit match');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdvance = async () => {
    setAdvancing(true);
    try {
      const res = await matchAPI.advance(sportId);
      toast.success(`🚀 Advanced to ${res.data.data.currentLevel}!`);
      setLastResult(null);
      await fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot advance yet');
    } finally {
      setAdvancing(false);
    }
  };

  const canAdvance = progress &&
    progress.matchesPlayedInLevel >= (sport?.matchesPerLevel || 5) &&
    progress.winsInLevel >= (sport?.winsRequiredToAdvance || 3);

  const isLevelFull = progress && progress.matchesRemainingInLevel <= 0;

  if (loading) return <div className="pt-20"><Loader text="Loading arena..." /></div>;
  if (!sport) return <div className="pt-20 text-center text-white">Sport not found</div>;

  const gradient = CATEGORY_COLORS[sport.category] || 'from-gray-600 to-gray-800';

  const scoreConfig = getConfig(sport?.scoreType);

  return (
    <>
    <WinCelebration
      show={showCelebration}
      onClose={() => setShowCelebration(false)}
      sportName={sport?.name}
    />
    <div className="min-h-screen bg-hero-gradient pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-3xl shadow-xl`}>
              {CATEGORY_ICONS[sport.category] || '🏆'}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">{sport.name}</h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {progress && <LevelBadge level={progress.currentLevel} size="sm" />}
                {sport.olympicSport && (
                  <span className="flex items-center gap-1 text-xs text-gold">
                    <Trophy className="w-3 h-3" /> Olympic Sport
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Submit form + progress */}
          <div className="lg:col-span-2 space-y-5">
            {/* Progress Card */}
            {progress && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-dark-700/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-white text-lg">Current Progress</h2>
                  <LevelBadge level={progress.currentLevel} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                  {[
                    { icon: '⚔️', label: 'Played', val: progress.totalMatches },
                    { icon: '🏆', label: 'Wins', val: progress.totalWins, color: 'text-green-400' },
                    { icon: '💔', label: 'Losses', val: progress.totalLosses, color: 'text-red-400' },
                    { icon: '📊', label: 'Win Rate', val: `${progress.winRate}%`, color: 'text-primary-400' },
                  ].map((s) => (
                    <div key={s.label} className="text-center bg-white/5 rounded-xl p-3">
                      <div className="text-xl mb-1">{s.icon}</div>
                      <div className={`font-display font-bold text-lg ${s.color || 'text-white'}`}>{s.val}</div>
                      <div className="text-xs text-gray-500">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <ProgressBar
                    value={progress.matchesPlayedInLevel}
                    max={sport.matchesPerLevel}
                    label="Matches this level"
                    color={`bg-gradient-to-r ${gradient}`}
                  />
                  <ProgressBar
                    value={progress.winsInLevel}
                    max={sport.winsRequiredToAdvance}
                    label="Wins needed to advance"
                    color="bg-gradient-to-r from-green-500 to-emerald-600"
                  />
                </div>

                {/* Qualification badges */}
                {(progress.qualifiedForDistrict || progress.qualifiedForState || progress.qualifiedForOlympics) && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {progress.qualifiedForDistrict && <span className="text-xs px-2 py-1 bg-bronze/20 border border-bronze/40 text-bronze rounded-full">🏅 District</span>}
                    {progress.qualifiedForState && <span className="text-xs px-2 py-1 bg-silver/20 border border-silver/40 text-silver rounded-full">🥈 State</span>}
                    {progress.qualifiedForOlympics && <span className="text-xs px-2 py-1 bg-gold/20 border border-gold/40 text-gold rounded-full">🥇 Olympics!</span>}
                  </div>
                )}

                {/* Advance button */}
                {canAdvance && progress.currentLevel !== 'OLYMPICS' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleAdvance}
                    disabled={advancing}
                    className="mt-4 w-full py-3 bg-gradient-to-r from-gold/80 to-orange-500 text-dark-900 font-display font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-gold/20 disabled:opacity-50"
                  >
                    {advancing ? <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin" /> : (
                      <><ArrowRight className="w-5 h-5" /> Advance to Next Level!</>
                    )}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Match Submit Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-dark-700/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <h2 className="font-display font-bold text-white text-lg mb-1 flex items-center gap-2">
                <Sword className="w-5 h-5 text-primary-400" /> Submit Match Result
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                {isLevelFull
                  ? canAdvance
                    ? '✅ Level complete! Click "Advance" above to move up.'
                    : `❌ Level complete but you only have ${progress?.winsInLevel} wins (need ${sport.winsRequiredToAdvance}). You cannot advance.`
                  : `Enter your match score. You need ${sport.winsRequiredToAdvance} wins out of ${sport.matchesPerLevel} matches to advance.`
                }
              </p>

              <SportScoreForm
                scoreType={sport?.scoreType}
                onSubmit={handleSubmit}
                disabled={submitting || isLevelFull}
              />

              {/* Last result flash */}
              <AnimatePresence>
                {lastResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    className={`mt-4 p-4 rounded-xl border text-center ${RESULT_CONFIG[lastResult.result]?.bg}`}
                  >
                    <span className="text-4xl block mb-1">{RESULT_CONFIG[lastResult.result]?.icon}</span>
                    <p className={`font-display font-bold text-lg ${RESULT_CONFIG[lastResult.result]?.color}`}>
                      {RESULT_CONFIG[lastResult.result]?.label}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {lastResult.playerScore} — {lastResult.opponentScore}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right: Match history */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-dark-700/80 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary-400" /> Match History
                </h2>
                <button
                  onClick={() => navigate(`/performance/${sportId}`)}
                  className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
                >
                  Full Stats <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">⚔️</span>
                  <p className="text-gray-500 text-sm mt-2">No matches yet. Start playing!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {history.slice(0, 20).map((m, i) => {
                    const rc = RESULT_CONFIG[m.result];
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className={`flex items-center justify-between p-3 rounded-xl border ${rc?.bg || 'bg-white/5 border-white/10'}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{rc?.icon}</span>
                          <div>
                            <div className={`text-xs font-semibold ${rc?.color}`}>{rc?.label}</div>
                            <div className="text-xs text-gray-500">Level {m.level?.replace('_', ' ')}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display font-bold text-white text-sm">
                            {m.scoreDetails
                              ? `${scoreConfig.getPlayerDisplay(m.scoreDetails)} — ${scoreConfig.getOpponentDisplay(m.scoreDetails)}`
                              : `${m.playerScore} — ${m.opponentScore}`
                            }
                          </div>
                          <div className="text-xs text-gray-600">#{m.matchNumberInLevel}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
