import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { matchAPI } from '../api/matchAPI';
import { sportsAPI } from '../api/sportsAPI';
import Loader from '../components/Loader';
import LevelBadge from '../components/LevelBadge';
import { Calendar, Trophy, TrendingUp, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MatchHistoryPage() {
  const [matches, setMatches] = useState([]);
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedResult, setSelectedResult] = useState('all');

  useEffect(() => {
    Promise.all([sportsAPI.getAll()])
      .then(([sRes]) => {
        setSports(sRes.data.data || []);
        
        // Fetch matches for all sports
        const allMatches = [];
        const sportsList = sRes.data.data || [];
        
        if (sportsList.length === 0) {
          setMatches([]);
          setLoading(false);
          return;
        }

        // Fetch match history for each sport
        Promise.all(sportsList.map((sport) => matchAPI.getHistory(sport.id)))
          .then((responses) => {
            responses.forEach((res) => {
              const sportMatches = res.data.data || [];
              allMatches.push(...sportMatches);
            });
            
            // Sort by date descending
            allMatches.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
            setMatches(allMatches);
          })
          .catch((err) => {
            console.error('Failed to load match history:', err);
            toast.error('Failed to load match history');
          })
          .finally(() => setLoading(false));
      })
      .catch((err) => {
        console.error('Failed to load sports:', err);
        toast.error('Failed to load sports');
        setLoading(false);
      });
  }, []);

  const getResultColor = (result) => {
    if (result === 'WIN') return { bg: 'bg-green-500/20', text: 'text-green-300', label: '✓ Win' };
    if (result === 'LOSS') return { bg: 'bg-red-500/20', text: 'text-red-300', label: '✗ Loss' };
    if (result === 'DRAW') return { bg: 'bg-yellow-500/20', text: 'text-yellow-300', label: '= Draw' };
    return { bg: 'bg-gray-500/20', text: 'text-gray-300', label: '⏳ Pending' };
  };

  const filteredMatches = matches.filter((match) => {
    const sportMatch = selectedSport === 'all' || match.sport === selectedSport;
    const resultMatch = selectedResult === 'all' || match.result === selectedResult;
    return sportMatch && resultMatch;
  });

  if (loading) return <div className="pt-20"><Loader text="Loading match history..." /></div>;

  const stats = {
    total: filteredMatches.length,
    wins: filteredMatches.filter((m) => m.result === 'WIN').length,
    losses: filteredMatches.filter((m) => m.result === 'LOSS').length,
    draws: filteredMatches.filter((m) => m.result === 'DRAW').length,
  };

  return (
    <div className="min-h-screen bg-hero-gradient pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/30 to-red-500/30 border border-orange-500/30 flex items-center justify-center text-2xl">
              ⚔️
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-white">
                Match <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">History</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">Review all your past matches and performances</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-gray-400 text-xs font-semibold">TOTAL MATCHES</p>
              <p className="text-white text-2xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <p className="text-green-300 text-xs font-semibold">WINS</p>
              <p className="text-green-400 text-2xl font-bold mt-2">{stats.wins}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-300 text-xs font-semibold">LOSSES</p>
              <p className="text-red-400 text-2xl font-bold mt-2">{stats.losses}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-300 text-xs font-semibold">DRAWS</p>
              <p className="text-yellow-400 text-2xl font-bold mt-2">{stats.draws}</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Filter:</span>
          </div>
          
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:border-primary-400 focus:outline-none"
          >
            <option value="all">All Sports</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id}>
                {sport.name}
              </option>
            ))}
          </select>

          <select
            value={selectedResult}
            onChange={(e) => setSelectedResult(e.target.value)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white text-sm focus:border-primary-400 focus:outline-none"
          >
            <option value="all">All Results</option>
            <option value="WIN">Wins</option>
            <option value="LOSS">Losses</option>
            <option value="DRAW">Draws</option>
            <option value="PENDING">Pending</option>
          </select>
        </motion.div>

        {/* Match List */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filteredMatches.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl"
            >
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 text-lg">No matches found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or play some matches!</p>
            </motion.div>
          ) : (
            filteredMatches.map((match, index) => {
              const resultColor = getResultColor(match.result);
              const matchDate = new Date(match.playedAt);
              const dateStr = matchDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              const timeStr = matchDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Result Badge */}
                    <div className="flex items-center justify-center">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 ${resultColor.bg} ${resultColor.text} rounded-full font-semibold text-sm`}
                      >
                        {resultColor.label}
                      </span>
                    </div>

                    {/* Sport & Level */}
                    <div className="md:col-span-2">
                      <p className="text-white font-semibold">{match.sport?.name || 'Unknown Sport'}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <LevelBadge level={match.level} size="sm" />
                        <span className="text-gray-400 text-xs">Level {match.matchNumberInLevel}</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="bg-white/10 rounded-lg px-3 py-2">
                          <p className="text-white font-bold text-lg">{match.playerScore}</p>
                          <p className="text-gray-400 text-xs">Your Score</p>
                        </div>
                        <p className="text-gray-500 font-bold">vs</p>
                        <div className="bg-white/10 rounded-lg px-3 py-2">
                          <p className="text-white font-bold text-lg">{match.opponentScore}</p>
                          <p className="text-gray-400 text-xs">Opponent</p>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <div className="text-sm">
                        <p className="text-white font-semibold">{dateStr}</p>
                        <p className="text-gray-500 text-xs">{timeStr}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {match.matchNotes && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-gray-400 text-xs font-semibold">NOTES</p>
                      <p className="text-gray-300 text-sm mt-1">{match.matchNotes}</p>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
