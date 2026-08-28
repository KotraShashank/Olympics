import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { leaderboardAPI } from '../api/leaderboardAPI';
import Loader from '../components/Loader';
import { Trophy, Medal, Flame, Zap, Target } from 'lucide-react';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('wins');

  useEffect(() => {
    leaderboardAPI
      .getLeaderboard(100)
      .then((res) => {
        setLeaderboard(res.data.data || []);
      })
      .catch((err) => {
        console.error('Failed to load leaderboard:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-20"><Loader text="Loading leaderboard..." /></div>;

  // Sort by selected metric
  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    if (selectedMetric === 'wins') return b.totalWins - a.totalWins;
    if (selectedMetric === 'winRate') return b.winRate - a.winRate;
    if (selectedMetric === 'qualifications') return b.olympicQualifications - a.olympicQualifications;
    return b.totalWins - a.totalWins;
  });

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-500 to-yellow-600';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-orange-500 to-orange-600';
    return 'from-gray-700 to-gray-800';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '⭐';
  };

  const getMedalColor = (rank) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-gray-500';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-hero-gradient pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/30 to-orange-500/30 border border-gold/30 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-white">
                Global <span className="bg-gradient-to-r from-gold to-orange-400 bg-clip-text text-transparent">Leaderboard</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">Rank yourself against other olympians</p>
            </div>
          </div>
        </motion.div>

        {/* Metric Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedMetric('wins')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              selectedMetric === 'wins'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <span className="flex items-center gap-2">
              🏆 Total Wins
            </span>
          </button>
          <button
            onClick={() => setSelectedMetric('winRate')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              selectedMetric === 'winRate'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <span className="flex items-center gap-2">
              📊 Win Rate
            </span>
          </button>
          <button
            onClick={() => setSelectedMetric('qualifications')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              selectedMetric === 'qualifications'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            <span className="flex items-center gap-2">
              🥇 Olympic Qualifications
            </span>
          </button>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 sticky top-20 z-40">
            <div className="col-span-1 text-gray-400 text-sm font-semibold">RANK</div>
            <div className="col-span-3 text-gray-400 text-sm font-semibold">PLAYER</div>
            <div className="col-span-2 text-gray-400 text-sm font-semibold text-center">MATCHES</div>
            <div className="col-span-2 text-gray-400 text-sm font-semibold text-center">WINS</div>
            <div className="col-span-2 text-gray-400 text-sm font-semibold text-center">WIN %</div>
            <div className="col-span-2 text-gray-400 text-sm font-semibold text-center">SPORTS</div>
          </div>

          {/* Leaderboard Rows */}
          {sortedLeaderboard.map((entry, index) => {
            const displayRank = index + 1;
            const isTopThree = displayRank <= 3;

            return (
              <motion.div
                key={entry.userId}
                variants={itemVariants}
                className={`group relative`}
              >
                <div
                  className={`grid grid-cols-12 gap-4 px-4 py-4 rounded-xl border transition-all ${
                    isTopThree
                      ? `bg-gradient-to-r ${getRankColor(displayRank)}/20 border-white/20 hover:border-white/40 shadow-lg shadow-${displayRank === 1 ? 'yellow' : displayRank === 2 ? 'gray' : 'orange'}-500/20`
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <span className={`text-2xl ${getMedalColor(displayRank)}`}>
                        {getRankIcon(displayRank)}
                      </span>
                      {!isTopThree && (
                        <span className="text-gray-400 text-xs font-semibold mt-1">
                          #{displayRank}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Player Name */}
                  <div className="col-span-3 flex items-center">
                    <div className="flex-1">
                      <p className={`font-display font-bold ${
                        isTopThree
                          ? 'text-white text-lg'
                          : 'text-gray-200'
                      }`}>
                        {entry.username}
                      </p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {entry.olympicQualifications > 0 && (
                          <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">
                            {entry.olympicQualifications} 🥇
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Total Matches */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white font-bold text-lg">{entry.totalMatches}</p>
                      <p className="text-gray-400 text-xs">matches</p>
                    </div>
                  </div>

                  {/* Total Wins */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-green-400 font-bold text-lg">{entry.totalWins}</p>
                      <p className="text-gray-400 text-xs">wins</p>
                    </div>
                  </div>

                  {/* Win Rate */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      <p className={`font-bold text-lg ${
                        entry.winRate >= 75 ? 'text-green-400'
                          : entry.winRate >= 50 ? 'text-blue-400'
                          : 'text-orange-400'
                      }`}>
                        {entry.winRate.toFixed(1)}%
                      </p>
                      <div className="w-16 h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                          style={{ width: `${entry.winRate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sports Played */}
                  <div className="col-span-2 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-primary-400 font-bold text-lg">{entry.sportsPlayed}</p>
                      <p className="text-gray-400 text-xs">sports</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">No leaderboard data available yet</p>
            <p className="text-gray-500 text-sm mt-2">Start playing matches to see rankings!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
