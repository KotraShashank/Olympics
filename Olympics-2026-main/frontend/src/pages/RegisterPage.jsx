import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Trophy, Eye, EyeOff, Medal, Rocket } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  username: z.string().min(3, 'At least 3 characters').max(50),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'At least 6 characters'),
  confirmPassword: z.string(),
  fullName: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const benefits = [
  { icon: '🏆', text: 'Compete in 35+ Olympic sports' },
  { icon: '📈', text: 'Track your performance across levels' },
  { icon: '🥇', text: 'Qualify from Local → District → State → Olympics' },
];

export default function RegisterPage() {
  const { register: registerUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ confirmPassword, ...data }) => {
    const ok = await registerUser(data);
    if (ok) navigate('/sports');
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-primary-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left — Branding */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block"
        >
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-10 h-10 text-gold" />
            <span className="font-display text-3xl font-bold bg-gradient-to-r from-gold to-orange-400 bg-clip-text text-transparent">
              OlympicPath
            </span>
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Your journey to the<br />
            <span className="bg-gradient-to-r from-gold to-orange-400 bg-clip-text text-transparent">Olympics</span> starts here
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Train. Compete. Qualify. Rise through 5 levels, win your district and state, and earn your Olympic spot.
          </p>
          <div className="space-y-4">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
              >
                <span className="text-2xl">{b.icon}</span>
                <span className="text-gray-300">{b.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — Form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-dark-800/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="md:hidden flex items-center justify-center gap-2 mb-3">
                <Trophy className="w-7 h-7 text-gold" />
                <span className="font-display text-xl font-bold text-white">OlympicPath</span>
              </div>
              <h1 className="font-display text-2xl font-bold text-white">Create Account</h1>
              <p className="text-gray-400 text-sm mt-1">Join thousands of athletes worldwide</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Username *</label>
                  <input
                    {...register('username')}
                    type="text"
                    autoComplete="username"
                    placeholder="athlete123"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                  />
                  {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">Full Name</label>
                  <input
                    {...register('fullName')}
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Email *</label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  placeholder="athlete@email.com"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Password *</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all pr-10"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Confirm Password *</label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-all"
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                className="w-full py-3 bg-gradient-to-r from-gold/80 to-orange-500 hover:from-gold hover:to-orange-400 text-dark-900 font-display font-bold rounded-xl transition-all duration-200 shadow-lg shadow-gold/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-dark-800/30 border-t-dark-800 rounded-full animate-spin" />
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Begin My Journey
                  </>
                )}
              </motion.button>
            </form>

            <p className="text-center mt-5 text-sm text-gray-500">
              Already competing?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
