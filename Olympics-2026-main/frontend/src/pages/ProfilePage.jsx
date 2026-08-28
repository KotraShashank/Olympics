import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/authAPI';
import { performanceAPI } from '../api/performanceAPI';
import Loader from '../components/Loader';
import StatCard from '../components/StatCard';
import { User, Mail, Calendar, Trophy, Activity, Zap, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    Promise.all([
      performanceAPI.getAllProgress(),
      authAPI.getProfile(),
    ])
      .then(([progRes, profileRes]) => {
        const progressList = progRes.data.data || [];
        const profileData = profileRes.data.data || {};
        
        const totalWins = progressList.reduce((s, p) => s + p.totalWins, 0);
        const totalMatches = progressList.reduce((s, p) => s + p.totalMatches, 0);
        const olympicCount = progressList.filter((p) => p.qualifiedForOlympics).length;
        const stateCount = progressList.filter((p) => p.qualifiedForState).length;
        const districtCount = progressList.filter((p) => p.qualifiedForDistrict).length;

        setProfile({
          username: profileData.username || 'N/A',
          email: profileData.email || 'N/A',
          fullName: profileData.fullName || 'Not set',
          dateOfBirth: profileData.dateOfBirth || 'Not set',
        });

        setStats({
          totalWins,
          totalMatches,
          sportsActive: progressList.length,
          olympicQualifications: olympicCount,
          stateQualifications: stateCount,
          districtQualifications: districtCount,
          winRate: totalMatches > 0 ? ((totalWins / totalMatches) * 100).toFixed(1) : 0,
        });

        setFormData({
          username: profileData.username || '',
          email: profileData.email || '',
          fullName: profileData.fullName || '',
          dateOfBirth: profileData.dateOfBirth || '',
        });
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        toast.error('Failed to load profile data');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await authAPI.updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setProfile(formData);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) return <div className="pt-20"><Loader text="Loading profile..." /></div>;

  return (
    <div className="min-h-screen bg-hero-gradient pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/30 to-primary-500/30 border border-blue-500/30 flex items-center justify-center text-2xl">
              👤
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold text-white">
                My <span className="bg-gradient-to-r from-blue-400 to-primary-400 bg-clip-text text-transparent">Profile</span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">View and manage your account information</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon="⚽" label="Sports Active" value={stats.sportsActive} delay={0} />
              <StatCard icon="🏆" label="Total Wins" value={stats.totalWins} color="text-green-400" delay={0.1} />
              <StatCard icon="📊" label="Win Rate" value={`${stats.winRate}%`} color="text-blue-400" delay={0.2} />
              <StatCard icon="🥇" label="Olympic Qualified" value={stats.olympicQualifications} color="text-gold" delay={0.3} />
              <StatCard icon="🥈" label="State Qualified" value={stats.stateQualifications} color="text-gray-300" delay={0.4} />
              <StatCard icon="🏅" label="District Qualified" value={stats.districtQualifications} color="text-orange-400" delay={0.5} />
            </div>
          </motion.div>
        )}

        {/* Profile Info */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-bold text-white text-2xl flex items-center gap-2">
                <User className="w-6 h-6 text-blue-400" /> Account Information
              </h2>
              <button
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  isEditing
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 disabled:opacity-50"
                  />
                ) : (
                  <p className="text-white text-lg font-medium">{profile.username}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Username cannot be changed</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 disabled:opacity-50"
                  />
                ) : (
                  <p className="text-white text-lg font-medium">{profile.email}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Email cannot be changed</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors"
                  />
                ) : (
                  <p className="text-white text-lg font-medium">{profile.fullName}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-gray-400 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-blue-400 focus:outline-none transition-colors"
                  />
                ) : (
                  <p className="text-white text-lg font-medium">{profile.dateOfBirth}</p>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        username: profile.username,
                        email: profile.email,
                        fullName: profile.fullName,
                        dateOfBirth: profile.dateOfBirth,
                      });
                    }}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Account Status */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-display font-bold text-white text-lg mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-400" /> Account Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Status</span>
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Member Since</span>
                <span className="text-white font-semibold">2026</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-display font-bold text-white text-lg mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-gold" /> Quick Links
            </h3>
            <div className="space-y-2">
              <a
                href="/leaderboard"
                className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">View Leaderboard</span>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-primary-400" />
              </a>
              <a
                href="/match-history"
                className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Match History</span>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-primary-400" />
              </a>
              <a
                href="/qualifications"
                className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
              >
                <span className="text-gray-300 group-hover:text-white">Qualifications</span>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-primary-400" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
