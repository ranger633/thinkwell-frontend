import { useState, useEffect } from 'react';
import { BookOpen, Plus, X, Calendar, Tag, Sparkles } from 'lucide-react';
import api from '../utils/api';

export default function Journal() {
  const [journals, setJournals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const res = await api.get('/journal');
      setJournals(res.data.journals || []);
    } catch (err) {
      // Sample journals
      setJournals([
        {
          _id: '1',
          title: 'A Good Start',
          content: 'Today I woke up feeling refreshed. The morning walk helped clear my mind. I practiced gratitude and listed three things I am thankful for.',
          date: new Date().toISOString(),
          sentiment: { label: 'positive', score: 0.6 },
          tags: ['morning', 'gratitude'],
          aiSummary: 'Positive morning routine with gratitude practice and physical activity.'
        },
        {
          _id: '2',
          title: 'Dealing with Stress',
          content: 'Work has been overwhelming lately. Deadlines are piling up and I feel like I cannot keep up. I tried the breathing exercises which helped a bit.',
          date: new Date(Date.now() - 86400000).toISOString(),
          sentiment: { label: 'mixed', score: -0.1 },
          tags: ['work', 'stress', 'breathing'],
          aiSummary: 'Work stress is high but coping with breathing exercises.'
        }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/journal', {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setJournals(prev => [res.data.journal, ...prev]);
    } catch (err) {
      // Add locally
      setJournals(prev => [{
        _id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        sentiment: { label: 'neutral', score: 0 },
        aiSummary: content.substring(0, 100) + '...'
      }, ...prev]);
    } finally {
      setLoading(false);
      setShowForm(false);
      setTitle('');
      setContent('');
      setTags('');
    }
  };

  const getSentimentColor = (label) => {
    switch (label) {
      case 'positive': return 'bg-sage-100 text-sage-700';
      case 'negative': return 'bg-clay-100 text-clay-700';
      case 'mixed': return 'bg-sand-100 text-sand-700';
      default: return 'bg-earth-100 text-earth-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-earth-900">Journal</h2>
          <p className="text-sm text-earth-500 mt-1">Express your thoughts. Get insights and summaries.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'New Entry'}
        </button>
      </div>

      {/* New Entry Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card mb-6 border-sage-200">
          <h3 className="text-lg font-semibold text-earth-900 mb-4">New Journal Entry</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Give your entry a title..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Your thoughts</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field h-40 resize-none"
                placeholder="Write freely... This is your safe space. Express whatever is on your mind."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="input-field"
                placeholder="e.g., work, gratitude, reflection"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </div>
        </form>
      )}

      {/* Journal Detail View */}
      {selectedJournal && (
        <div className="card mb-6 border-sage-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-earth-900">{selectedJournal.title}</h3>
            <button onClick={() => setSelectedJournal(null)} className="p-1 text-earth-400 hover:text-earth-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-earth-500 mb-4">
            {new Date(selectedJournal.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <p className="text-earth-700 leading-relaxed whitespace-pre-wrap mb-4">{selectedJournal.content}</p>

          {selectedJournal.aiSummary && (
            <div className="bg-sage-50 rounded-xl p-4 border border-sage-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-sage-600" />
                <span className="text-sm font-semibold text-sage-700">Insight</span>
              </div>
              <p className="text-sm text-sage-700">{selectedJournal.aiSummary}</p>
            </div>
          )}

          {selectedJournal.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedJournal.tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-earth-100 text-earth-600 text-xs rounded-full">
                  <Tag className="w-3 h-3" />{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Journal List */}
      <div className="space-y-3">
        {journals.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="w-12 h-12 text-earth-300 mx-auto mb-3" />
            <p className="text-earth-500">No journal entries yet. Start writing to track your thoughts.</p>
          </div>
        ) : (
          journals.map((journal) => (
            <div
              key={journal._id}
              onClick={() => setSelectedJournal(journal)}
              className="card cursor-pointer hover:border-sage-200 group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-earth-900 group-hover:text-sage-700 transition-colors">
                    {journal.title}
                  </h4>
                  <p className="text-sm text-earth-500 mt-1 line-clamp-2">{journal.content}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="inline-flex items-center gap-1 text-xs text-earth-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(journal.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    {journal.sentiment && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSentimentColor(journal.sentiment.label)}`}>
                        {journal.sentiment.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
