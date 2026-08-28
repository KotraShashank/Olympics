import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { performanceAPI } from '../api/performanceAPI';
import Loader from '../components/Loader';
import LevelBadge from '../components/LevelBadge';
import { Trophy, Target, TrendingUp, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QualificationsPage() {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceAPI
      .getAllProgress()
      .then((res) => {
        setProgressList(res.data.data || []);
      })
      .catch((err) => {
        console.error('Failed to load qualifications:', err);
        toast.error('Failed to load qualifications');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-20"><Loader text="Loading qualifications..." /></div>;

  // Separate qualified and not qualified
  const districtQualified = progressList.filter((p) => p.qualifiedForDistrict);
  const stateQualified = progressList.filter((p) => p.qualifiedForState);
  const olympicQualified = progressList.filter((p) => p.qualifiedForOlympics);
  const notQualified = progressList.filter(
    (p) => !p.qualifiedForDistrict && !p.qualifiedForState && !p.qualifiedForOlympics
  );

  const QUALIFICATION_LEVELS = [
    {
      title: 'Olympic Qualification',
      icon: '🥇',
      color: 'from-yellow-500 to-yellow-600',
      badgeColor: 'bg-yellow-500/20 text-yellow-300',
      list: olympicQualified,
      description: 'Qualified for the Olympics - Highest level of achievement!',
    },
    {
      title: 'State Qualification',
      icon: '🥈',
      color: 'from-gray-400 to-gray-500',
      badgeColor: 'bg-gray-500/20 text-gray-300',
      list: stateQualified,
      description: 'Qualified for state-level competitions',
    },
    {
      title: 'District Qualification',
      icon: '🏅',
      color: 'from-orange-500 to-orange-600',
      badgeColor: 'bg-orange-500/20 text-orange-300',
      list: districtQualified,
      description: 'Qualified for district-level competitions',
    },
  ];

  const QualificationCard = ({ qualification, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      key={qualification.sportId}
      className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl overflow-hidden transition-all group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gray-400 text-sm font-semibold mb-1">SPORT</p>
            <h3 className="text-white text-xl font-bold group-hover:text-primary-300 transition-colors">
              {qualification.sportName || 'Unknown Sport'}
            </h3>
          </div>
          <LevelBadge level={qualification.currentLevel} size="md" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-gray-400 text-xs">Matches</p>
            <p className="text-white font-bold text-lg">{qualification.totalMatches}</p>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3 text-center">
            <p className="text-green-300 text-xs">Wins</p>
            <p className="text-green-400 font-bold text-lg">{qualification.totalWins}</p>
          </div>
          <div className="bg-blue-500/10 rounded-lg p-3 text-center">
            <p className="text-blue-300 text-xs">Win Rate</p>
            <p className="text-blue-400 font-bold text-lg">
              {qualification.totalMatches > 0
                ? ((qualification.totalWins / qualification.totalMatches) * 100).toFixed(0)
                : 0}
              %
            </p>
          </div>
        </div>

        {/* Qualification Badges */}
        <div className="space-y-2">
          <div
            className={`flex items-center gap-3 p-3 rounded-lg ${
              qualification.qualifiedForDistrict
                ? 'bg-orange-500/20 border border-orange-500/30'
                : 'bg-gray-500/10 border border-gray-500/20'
            }`}
          >
            {qualification.qualifiedForDistrict ? (
              <CheckCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
            ) : (
              <Target className="w-5 h-5 text-gray-500 flex-shrink-0" />
            )}
            <span
              className={`text-sm font-semibold ${
                qualification.qualifiedForDistrict ? 'text-orange-300' : 'text-gray-400'
              }`}
            >
              {qualification.qualifiedForDistrict ? '✓ District Qualified' : 'District Qualification'}
            </span>
          </div>

          <div
            className={`flex items-center gap-3 p-3 rounded-lg ${
              qualification.qualifiedForState
                ? 'bg-gray-500/20 border border-gray-500/30'
                : 'bg-gray-500/10 border border-gray-500/20'
            }`}
          >
            {qualification.qualifiedForState ? (
              <CheckCircle className="w-5 h-5 text-gray-300 flex-shrink-0" />
            ) : (
              <Target className="w-5 h-5 text-gray-500 flex-shrink-0" />
            )}
            <span
              className={`text-sm font-semibold ${
                qualification.qualifiedForState ? 'text-gray-300' : 'text-gray-400'
              }`}
            >
              {qualification.qualifiedForState ? '✓ State Qualified' : 'State Qualification'}
            </span>
          </div>

          <div
            className={`flex items-center gap-3 p-3 rounded-lg ${
              qualification.qualifiedForOlympics
                ? 'bg-yellow-500/20 border border-yellow-500/30'
                : 'bg-gray-500/10 border border-gray-500/20'
            }`}
          >
            {qualification.qualifiedForOlympics ? (
              <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            ) : (
              <Target className="w-5 h-5 text-gray-500 flex-shrink-0" />
            )}
            <span
              className={`text-sm font-semibold ${
                qualification.qualifiedForOlympics ? 'text-yellow-300' : 'text-gray-400'
              }`}
            >
              {qualification.qualifiedForOlympics ? '🥇 Olympics Qualified' : 'Olympic Qualification'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-hero-gradient pt-20 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/30 to-blue-500/30 border border-purple-500/30 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-white">
                My <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Qualifications</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">Track your journey to Olympic qualification</p>
            </div>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-xl p-6 text-center">
              <p className="text-yellow-300 text-sm font-semibold">OLYMPIC</p>
              <p className="text-yellow-400 text-3xl font-bold mt-2">{olympicQualified.length}</p>
            </div>
            <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 border border-gray-500/30 rounded-xl p-6 text-center">
              <p className="text-gray-300 text-sm font-semibold">STATE</p>
              <p className="text-gray-400 text-3xl font-bold mt-2">{stateQualified.length}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-xl p-6 text-center">
              <p className="text-orange-300 text-sm font-semibold">DISTRICT</p>
              <p className="text-orange-400 text-3xl font-bold mt-2">{districtQualified.length}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-6 text-center">
              <p className="text-blue-300 text-sm font-semibold">ACTIVE</p>
              <p className="text-blue-400 text-3xl font-bold mt-2">{progressList.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Qualification Levels */}
        {QUALIFICATION_LEVELS.map((level, levelIndex) => (
          <div key={levelIndex} className="mb-12">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: levelIndex * 0.1 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{level.icon}</span>
                <div>
                  <h2 className={`font-display text-2xl font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                    {level.title}
                  </h2>
                  <p className="text-gray-400 text-sm">{level.description}</p>
                </div>
              </div>
            </motion.div>

            {/* Qualification Cards */}
            {level.list.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {level.list.map((item, index) => (
                  <QualificationCard key={item.sportId} qualification={item} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-8 text-center"
              >
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-50" />
                <p className="text-gray-400">No qualifications yet. Keep improving to unlock this achievement!</p>
              </motion.div>
            )}
          </div>
        ))}

        {/* Active Sports (Not Yet Qualified) */}
        {notQualified.length > 0 && (
          <div className="mt-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🎮</span>
                <div>
                  <h2 className="font-display text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Active Sports (Working Towards Qualification)
                  </h2>
                  <p className="text-gray-400 text-sm">Sports where you're still building your qualification</p>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {notQualified.map((item, index) => (
                <QualificationCard key={item.sportId} qualification={item} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {progressList.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg">No sports active yet</p>
            <p className="text-gray-500 text-sm mt-2">Start playing matches to begin your qualification journey!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
