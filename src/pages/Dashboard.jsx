import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Smile, TrendingUp, Moon, Activity,
  AlertTriangle, Wind, BookOpen, Heart, MessageCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../utils/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/mood/analytics?days=7');
      setAnalytics(res.data.analytics);
    } catch (err) {
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const hasData = analytics && analytics.totalEntries > 0;

  const moodData = hasData
    ? analytics.dailyScores.map(d => ({
        date: new Date(d.date).toLocaleDateString('en', { weekday: 'short' }),
        score: d.score || d.moodScore,
        stress: d.stress || d.stressLevel,
      }))
    : [];

  const quickActions = [
    { icon: MessageCircle, label: 'Talk', path: '/app/chat', color: 'bg-sage-100 text-sage-700', desc: 'Chat with ThinkWell' },
    { icon: Smile, label: 'Log Mood', path: '/app/mood', color: 'bg-sand-100 text-sand-700', desc: 'Track how you feel' },
    { icon: Wind, label: 'Breathe', path: '/app/breathing', color: 'bg-moss-100 text-moss-700', desc: 'Guided exercises' },
    { icon: BookOpen, label: 'Journal', path: '/app/journal', color: 'bg-earth-200 text-earth-700', desc: 'Write your thoughts' },
    { icon: Heart, label: 'Wellness', path: '/app/wellness', color: 'bg-clay-100 text-clay-700', desc: 'Personalized plans' },
    { icon: AlertTriangle, label: 'SOS', path: '/app/sos', color: 'bg-clay-100 text-clay-700', desc: 'Emergency help' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-sage-600 to-sage-700 rounded-3xl p-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">{greeting}, {user?.name?.split(' ')[0]} ðŸŒ¿</h1>
        <p className="mt-2 text-sage-100 text-lg">
          {hasData
            ? `Your average mood this week is ${analytics.avgMoodScore}/10. ${analytics.avgStress > 6 ? "Let's work on bringing that stress down." : "You're doing well â€” keep it up!"}`
            : "Welcome to ThinkWell. Start a conversation or log your mood to get personalized insights."
          }
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/app/chat" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all">
            <MessageCircle className="w-4 h-4" /> Start chatting
          </Link>
          <Link to="/app/mood" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all">
            <Smile className="w-4 h-4" /> Log your mood
          </Link>
        </div>
      </div>

      {/* Stats Cards - only show real data */}
      {hasData && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-sage-100 rounded-xl flex items-center justify-center">
                <Smile className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <p className="text-sm text-earth-500">Mood</p>
                <p className="text-2xl font-bold text-earth-900">{analytics.avgMoodScore}<span className="text-sm font-normal text-earth-400">/10</span></p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-clay-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-clay-600" />
              </div>
              <div>
                <p className="text-sm text-earth-500">Stress</p>
                <p className="text-2xl font-bold text-earth-900">{analytics.avgStress}<span className="text-sm font-normal text-earth-400">/10</span></p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-sand-100 rounded-xl flex items-center justify-center">
                <Moon className="w-6 h-6 text-sand-600" />
              </div>
              <div>
                <p className="text-sm text-earth-500">Sleep</p>
                <p className="text-2xl font-bold text-earth-900">{analytics.avgSleep}<span className="text-sm font-normal text-earth-400">hrs</span></p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-moss-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-moss-600" />
              </div>
              <div>
                <p className="text-sm text-earth-500">Entries</p>
                <p className="text-2xl font-bold text-earth-900">{analytics.totalEntries}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mood Chart - only if data */}
      {hasData && moodData.length > 1 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-earth-900 mb-4">Your Week</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#537d53" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#537d53" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cd5030" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#cd5030" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2d1b8" />
                <XAxis dataKey="date" stroke="#8b5335" fontSize={12} />
                <YAxis stroke="#8b5335" fontSize={12} domain={[0, 10]} />
                <Tooltip contentStyle={{ backgroundColor: '#faf6f1', border: '1px solid #e2d1b8', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="score" stroke="#537d53" fill="url(#moodGradient)" strokeWidth={2.5} name="Mood" />
                <Area type="monotone" dataKey="stress" stroke="#cd5030" fill="url(#stressGradient)" strokeWidth={2} name="Stress" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Onboarding for new users */}
      {!hasData && !loading && (
        <div className="card bg-gradient-to-br from-sand-50 to-earth-50 border-sand-200">
          <h3 className="text-lg font-semibold text-earth-900 mb-2">Get started in 3 steps</h3>
          <p className="text-sm text-earth-500 mb-4">ThinkWell learns from you to provide personalized support.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/app/chat" className="p-4 bg-white rounded-xl border border-earth-100 hover:border-sage-200 transition-all group">
              <span className="text-2xl">ðŸ’¬</span>
              <p className="font-medium text-earth-900 mt-2 group-hover:text-sage-700">1. Have a conversation</p>
              <p className="text-xs text-earth-500 mt-1">ThinkWell tracks your mood automatically from chat</p>
            </Link>
            <Link to="/app/mood" className="p-4 bg-white rounded-xl border border-earth-100 hover:border-sage-200 transition-all group">
              <span className="text-2xl">ðŸ“Š</span>
              <p className="font-medium text-earth-900 mt-2 group-hover:text-sage-700">2. Log your mood</p>
              <p className="text-xs text-earth-500 mt-1">Quick daily check-in builds your emotional profile</p>
            </Link>
            <Link to="/app/wellness" className="p-4 bg-white rounded-xl border border-earth-100 hover:border-sage-200 transition-all group">
              <span className="text-2xl">ðŸŒ¿</span>
              <p className="font-medium text-earth-900 mt-2 group-hover:text-sage-700">3. Get personalized plans</p>
              <p className="text-xs text-earth-500 mt-1">Exercises adapt to your stress, sleep & mood patterns</p>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-earth-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link key={action.path} to={action.path} className="card flex flex-col items-center gap-2 py-5 hover:scale-105 transition-transform">
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-earth-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
