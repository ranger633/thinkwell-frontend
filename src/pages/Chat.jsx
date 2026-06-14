import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, Sparkles, History, Plus } from 'lucide-react';
import api from '../utils/api';

const QUICK_PROMPTS = [
  "I'm feeling anxious today",
  "I need someone to talk to",
  "Help me with stress",
  "I'm feeling down",
  "I can't sleep well",
  "I need a coping strategy"
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showSessions, setShowSessions] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const messagesEndRef = useRef(null);

  // Load sessions and last chat on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Load all sessions
  const loadSessions = async () => {
    try {
      const res = await api.get('/chat/sessions');
      const allSessions = res.data.sessions || [];
      setSessions(allSessions);

      // Load the most recent session that has messages
      const validSession = allSessions.find(s => s.messageCount > 0);
      if (validSession) {
        await loadSession(validSession.sessionId);
      } else {
        startNewSession();
      }
    } catch (err) {
      startNewSession();
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load a specific session's messages
  const loadSession = async (sid) => {
    try {
      const res = await api.get(`/chat/history?sessionId=${sid}`);
      const chat = res.data.chats?.[0];
      if (chat && chat.messages.length > 0) {
        setSessionId(chat.sessionId);
        setMessages(chat.messages.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.timestamp
        })));
        setCrisisAlert(chat.crisisDetected || false);
      } else {
        startNewSession();
      }
    } catch {
      startNewSession();
    }
    setShowSessions(false);
  };

  // Start a new chat session
  const startNewSession = () => {
    const newId = `session-${Date.now()}`;
    setSessionId(newId);
    setMessages([{
      role: 'assistant',
      content: "Hello! I'm ThinkWell, your personal mental health companion. I learn from our conversations and your mood patterns to provide support that's truly tailored to you. How are you feeling right now? 🌿",
      timestamp: new Date()
    }]);
    setCrisisAlert(false);
  };

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat/message', {
        message: text.trim(),
        sessionId
      });

      const { response, crisisDetected, sessionId: returnedSessionId } = res.data;
      if (returnedSessionId) setSessionId(returnedSessionId);
      if (crisisDetected) setCrisisAlert(true);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now, but I'm still here for you. Could you try sending that again?",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loadingHistory) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-[60vh]">
        <p className="text-earth-400 animate-pulse">Loading your conversations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-700 rounded-xl flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-earth-900">ThinkWell</h2>
          <p className="text-sm text-earth-500">Your personal companion · Remembers context</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSessions(!showSessions)} className="p-2 text-earth-400 hover:text-earth-700 hover:bg-earth-100 rounded-lg transition-colors" title="Chat History">
            <History className="w-5 h-5" />
          </button>
          <button onClick={() => startNewSession()} className="p-2 text-earth-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-colors" title="New Chat">
            <Plus className="w-5 h-5" />
          </button>
          <span className="w-2 h-2 bg-sage-500 rounded-full animate-pulse"></span>
        </div>
      </div>

      {/* Sessions Panel */}
      {showSessions && sessions.length > 0 && (
        <div className="mb-4 bg-white border border-earth-200 rounded-xl p-3 max-h-48 overflow-y-auto shadow-sm">
          <p className="text-xs text-earth-400 font-medium mb-2 uppercase">Previous Sessions</p>
          {sessions.map((s) => (
            <button
              key={s.sessionId}
              onClick={() => loadSession(s.sessionId)}
              className={`w-full text-left p-2.5 rounded-lg text-sm hover:bg-earth-50 transition-colors mb-1 ${sessionId === s.sessionId ? 'bg-sage-50 border border-sage-200' : ''}`}
            >
              <p className="text-earth-700 truncate">{s.lastMessage || 'Chat session'}</p>
              <p className="text-xs text-earth-400 mt-0.5">{new Date(s.startedAt).toLocaleDateString()} · {s.messageCount} messages</p>
            </button>
          ))}
        </div>
      )}

      {/* Crisis Alert */}
      {crisisAlert && (
        <div className="mb-4 p-4 bg-clay-50 border border-clay-200 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-clay-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-clay-800">Crisis Support Available</p>
            <p className="text-sm text-clay-600 mt-1">
              If you're in distress, please call <strong>Vandrevala Foundation: 1860-2662-345</strong> (24/7, free) or <strong>Emergency: 112</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-sage-600" />
              </div>
            )}
            <div className={`max-w-[78%] p-4 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-sage-600 text-white rounded-br-md'
                : 'bg-white border border-earth-100 text-earth-800 rounded-bl-md shadow-sm'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              {msg.timestamp && (
                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-sage-200' : 'text-earth-300'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-earth-200 rounded-lg flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-earth-600" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-sage-600" />
            </div>
            <div className="bg-white border border-earth-100 rounded-2xl rounded-bl-md p-4 shadow-sm">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts - only show for new/short sessions */}
      {messages.length <= 2 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button key={prompt} onClick={() => sendMessage(prompt)} className="text-xs bg-earth-100 hover:bg-earth-200 text-earth-700 px-3 py-1.5 rounded-full transition-colors">
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white border border-earth-200 rounded-2xl p-2 shadow-sm flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Share what's on your mind..."
          rows={1}
          className="flex-1 resize-none px-4 py-3 text-sm text-earth-900 placeholder:text-earth-400 focus:outline-none bg-transparent"
          style={{ maxHeight: '120px' }}
        />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading} className="p-3 bg-sage-600 hover:bg-sage-700 text-white rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
