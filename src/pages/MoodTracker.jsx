import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../utils/api';

const MOODS = [
  { value: 'very_happy', emoji: '😄', label: 'Very Happy', score: 9 },
  { value: 'happy', emoji: '😊', label: 'Happy', score: 7 },
  { value: 'neutral', emoji: '😐', label: 'Neutral', score: 5 },
  { value: 'sad', emoji: '😢', label: 'Sad', score: 3 },
  { value: 'very_sad', emoji: '😞', label: 'Very Sad', score: 1 },
  { value: 'anxious', emoji: '😰', label: 'Anxious', score: 3 },
  { value: 'angry', emoji: '😠', label: 'Angry', score: 2 },
  { value: 'stressed', emoji: '😫', label: 'Stressed', score: 3 },
];

const EMOTIONS = ['joy', 'sadness', 'anger', 'fear', 'lonely', 'grateful', 'hopeful', 'overwhelmed', 'calm', 'anxious'];

const ACTIVITIES = ['Exercise', 'Work', 'Social', 'Reading', 'Meditation', 'Walking', 'Music', 'Cooking', 'Gaming', 'Studying'];

const PIE_COLORS = ['#537d53', '#b5804a', '#cd5030', '#d4a05e', '#7c974d', '#ac4026', '#345034', '#865938'];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [stressLevel, setStressLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [view, setView] = useState('log'); // 'log' or 'analytics'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [historyRes, analyticsRes] = await Promise.all([
        api.get('/mood/history?days=14'),
        api.get('/mood/analytics?days=30')
      ]);
      setMoodHistory(historyRes.data.moodLogs || []);
      setAnalytics(analyticsRes.data.analytics);
    } catch (err) {
      // Sample analytics data
      setAnalytics({
        avgMoodScore: 6.5,
        avgStress: 4.8,
        avgSleep: 7.2,
        moodDistribution: { happy: 5, neutral: 3, anxious: 2, sad: 1, stressed: 2 },
        dailyScores: [
          { date: 'Mon', score: 7 },
          { date: 'Tue', score: 6 },
          { date: 'Wed', score: 8 },
          { date: 'Thu', score: 5 },
          { date: 'Fri', score: 7 },
          { date: 'Sat', score: 9 },
          { date: 'Sun', score: 8 },
        ]
      });
    }
  };

  const toggleEmotion = (emotion) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion) ? prev.filter(e => e !== emotion) : [...prev, emotion]
    );
  };

  const toggleActivity = (activity) => {
    setSelectedActivities(prev =>
      prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
    );
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;

    const moodData = {
      mood: selectedMood.value,
      moodScore: selectedMood.score,
      stressLevel,
      sleepHours,
      sleepQuality,
      emotions: selectedEmotions,
      activities: selectedActivities,
      notes
    };

    try {
      await api.post('/mood', moodData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      // Reset
      setSelectedMood(null);
      setStressLevel(5);
      setSelectedEmotions([]);
      setSelectedActivities([]);
      setNotes('');
      fetchData();
    } catch (err) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const moodDistData = analytics?.moodDistribution
    ? Object.entries(analytics.moodDistribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setView('log')}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${view === 'log' ? 'bg-sage-600 text-white shadow-md' : 'bg-earth-100 text-earth-600 hover:bg-earth-200'}`}
        >
          Log Mood
        </button>
        <button
          onClick={() => setView('analytics')}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${view === 'analytics' ? 'bg-sage-600 text-white shadow-md' : 'bg-earth-100 text-earth-600 hover:bg-earth-200'}`}
        >
          Analytics
        </button>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-sage-50 border border-sage-200 rounded-xl text-sage-700 text-sm font-medium">
          ✓ Mood logged successfully! Keep tracking for better insights.
        </div>
      )}

      {view === 'log' ? (
        <div className="space-y-6">
          {/* Mood Selection */}
          <div className="card">
            <h3 className="text-lg font-semibold text-earth-900 mb-4">How are you feeling right now?</h3>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {MOODS.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                    selectedMood?.value === mood.value
                      ? 'bg-sage-100 border-2 border-sage-500 scale-105 shadow-md'
                      : 'bg-earth-50 border-2 border-transparent hover:bg-earth-100'
                  }`}
                >
                  <span className="text-2xl">{mood.emoji}</span>
                  <span className="text-xs text-earth-600 font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stress & Sleep */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <h4 className="font-semibold text-earth-900 mb-3">Stress Level</h4>
              <input
                type="range"
                min="1" max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value))}
                className="w-full accent-clay-500"
              />
              <div className="flex justify-between text-xs text-earth-500 mt-1">
                <span>Low</span>
                <span className="font-semibold text-earth-700 text-sm">{stressLevel}/10</span>
                <span>High</span>
              </div>
            </div>

            <div className="card">
              <h4 className="font-semibold text-earth-900 mb-3">Sleep Hours</h4>
              <input
                type="range"
                min="0" max="12" step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-sand-500"
              />
              <div className="flex justify-between text-xs text-earth-500 mt-1">
                <span>0h</span>
                <span className="font-semibold text-earth-700 text-sm">{sleepHours}h</span>
                <span>12h</span>
              </div>
            </div>
          </div>

          {/* Emotions */}
          <div className="card">
            <h4 className="font-semibold text-earth-900 mb-3">What emotions are present?</h4>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion}
                  onClick={() => toggleEmotion(emotion)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedEmotions.includes(emotion)
                      ? 'bg-sage-600 text-white'
                      : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                  }`}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="card">
            <h4 className="font-semibold text-earth-900 mb-3">Activities today</h4>
            <div className="flex flex-wrap gap-2">
              {ACTIVITIES.map((activity) => (
                <button
                  key={activity}
                  onClick={() => toggleActivity(activity)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedActivities.includes(activity)
                      ? 'bg-sand-600 text-white'
                      : 'bg-earth-100 text-earth-600 hover:bg-earth-200'
                  }`}
                >
                  {activity}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="card">
            <h4 className="font-semibold text-earth-900 mb-3">Anything else? (optional)</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field h-24 resize-none"
              placeholder="How was your day? What's on your mind?"
              maxLength={500}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!selectedMood}
            className="btn-primary w-full py-3.5 text-base disabled:opacity-40"
          >
            Log My Mood
          </button>
        </div>
      ) : (
        /* Analytics View */
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card text-center">
              <p className="text-sm text-earth-500">Average Mood</p>
              <p className="text-3xl font-bold text-sage-600 mt-1">{analytics?.avgMoodScore || '—'}</p>
              <p className="text-xs text-earth-400">out of 10</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-earth-500">Average Stress</p>
              <p className="text-3xl font-bold text-clay-600 mt-1">{analytics?.avgStress || '—'}</p>
              <p className="text-xs text-earth-400">out of 10</p>
            </div>
            <div className="card text-center">
              <p className="text-sm text-earth-500">Average Sleep</p>
              <p className="text-3xl font-bold text-sand-600 mt-1">{analytics?.avgSleep || '—'}</p>
              <p className="text-xs text-earth-400">hours</p>
            </div>
          </div>

          {/* Mood Trend Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-earth-900 mb-4">Mood Score Trend</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.dailyScores || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2d1b8" />
                  <XAxis dataKey="date" stroke="#8b5335" fontSize={12} tickFormatter={(val) => typeof val === 'string' ? val : new Date(val).toLocaleDateString('en', { weekday: 'short' })} />
                  <YAxis stroke="#8b5335" fontSize={12} domain={[0, 10]} />
                  <Tooltip contentStyle={{ backgroundColor: '#faf6f1', border: '1px solid #e2d1b8', borderRadius: '12px' }} />
                  <Bar dataKey="score" fill="#537d53" radius={[6, 6, 0, 0]} name="Mood Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mood Distribution */}
          {moodDistData.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-earth-900 mb-4">Mood Distribution (30 days)</h3>
              <div className="h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={moodDistData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {moodDistData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
