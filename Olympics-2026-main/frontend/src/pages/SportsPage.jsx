import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sportsAPI } from '../api/sportsAPI';
import { performanceAPI } from '../api/performanceAPI';
import Loader from '../components/Loader';
import LevelBadge from '../components/LevelBadge';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/constants';
import { Search, Filter, Trophy, ChevronRight } from 'lucide-react';

const ALL = 'ALL';

const CATEGORIES = [
  { key: ALL, label: 'All Sports', icon: '🌟' },
  { key: 'TRACK_AND_FIELD', label: 'Track & Field', icon: '🏃' },
  { key: 'AQUATICS', label: 'Aquatics', icon: '🏊' },
  { key: 'COMBAT', label: 'Combat', icon: '🥊' },
  { key: 'RACKET', label: 'Racket', icon: '🏸' },
  { key: 'TEAM', label: 'Team', icon: '⚽' },
  { key: 'GYMNASTICS', label: 'Gymnastics', icon: '🤸' },
  { key: 'SHOOTING', label: 'Shooting', icon: '🎯' },
  { key: 'CYCLING', label: 'Cycling', icon: '🚴' },
  { key: 'TRADITIONAL', label: 'Traditional', icon: '♟️' },
];

export default function SportsPage() {
  const [sports, setSports] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [showOlympicOnly, setShowOlympicOnly] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([sportsAPI.getAll(), performanceAPI.getAllProgress()])
      .then(([sportsRes, progressRes]) => {
        setSports(sportsRes.data.data || []);
        const map = {};
        (progressRes.data.data || []).forEach((p) => { map[p.sportId] = p; });
        setProgressMap(map);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return sports.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === ALL || s.category === activeCategory;
      const matchOlympic = !showOlympicOnly || s.olympicSport;
      return matchSearch && matchCat && matchOlympic;
    });
  }, [sports, search, activeCategory, showOlympicOnly]);

  if (loading) return <div className="pt-20"><Loader text="Loading sports..." /></div>;

  return (
    <div className="min-h-screen bg-hero-gradient pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            Choose Your <span className="bg-gradient-to-r from-gold to-orange-400 bg-clip-text text-transparent">Sport</span>
          </h1>
          <p className="text-gray-400 text-lg">Select a sport and begin your journey to the Olympics</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
          {/* Olympic toggle */}
          <button
            onClick={() => setShowOlympicOnly(!showOlympicOnly)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
              showOlympicOnly
                ? 'bg-gold/20 border-gold/40 text-gold'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Olympic Only
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeCategory === cat.key
                  ? 'bg-primary-600/30 border-primary-500/50 text-primary-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/8'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sports Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <span className="text-5xl">🔍</span>
              <p className="text-gray-400 mt-3">No sports match your search.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filtered.map((sport, i) => {
                const progress = progressMap[sport.id];
                const gradient = CATEGORY_COLORS[sport.category] || 'from-gray-600 to-gray-800';

                return (
                  <motion.div
                    key={sport.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => navigate(`/sports/${sport.id}/match`)}
                    className="cursor-pointer group"
                  >
                    <div className="relative bg-dark-700/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/25 transition-all duration-300 h-full">
                      {/* Gradient top bar */}
                      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

                      <div className="p-5">
                        {/* Icon + name */}
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
                            {CATEGORY_ICONS[sport.category] || '🏆'}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display font-bold text-white text-sm leading-tight group-hover:text-primary-300 transition-colors line-clamp-2">
                              {sport.name}
                            </h3>
                            {sport.olympicSport && (
                              <span className="inline-flex items-center gap-1 text-xs text-gold mt-1">
                                <Trophy className="w-3 h-3" /> Olympic
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{sport.description}</p>

                        {/* Progress */}
                        {progress ? (
                          <div className="space-y-2">
                            <LevelBadge level={progress.currentLevel} size="sm" />
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Matches: {progress.matchesPlayedInLevel}/{sport.matchesPerLevel}</span>
                              <span>{progress.winsInLevel}W</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                                style={{ width: `${Math.min((progress.matchesPlayedInLevel / sport.matchesPerLevel) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="inline-block text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg">Not started</span>
                        )}
                      </div>

                      {/* Play button */}
                      <div className="px-5 pb-4">
                        <div className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white/5 group-hover:bg-primary-600/20 border border-white/10 group-hover:border-primary-500/40 transition-all text-xs font-medium text-gray-400 group-hover:text-primary-300">
                          Play Now <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
