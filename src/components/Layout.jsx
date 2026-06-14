import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, MessageCircle, Smile, BookOpen,
  Heart, Wind, AlertTriangle, User, LogOut, Menu, X
} from 'lucide-react';
import logo from '../assets/logo.svg';

const navItems = [
  { path: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/app/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/app/mood', icon: Smile, label: 'Mood Tracker' },
  { path: '/app/journal', icon: BookOpen, label: 'Journal' },
  { path: '/app/wellness', icon: Heart, label: 'Wellness' },
  { path: '/app/breathing', icon: Wind, label: 'Breathing' },
  { path: '/app/sos', icon: AlertTriangle, label: 'SOS Alert' },
  { path: '/app/profile', icon: User, label: 'Profile' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-earth-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white border-r border-earth-100 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-earth-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-sage-500 to-sage-700 rounded-xl flex items-center justify-center shadow-md overflow-hidden p-2">
              <img src={logo} alt="ThinkWell" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-earth-900">ThinkWell</h1>
              <p className="text-xs text-earth-500">Mental Health Companion</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-sage-50 text-sage-700 shadow-sm border border-sage-100'
                  : 'text-earth-600 hover:bg-earth-50 hover:text-earth-900'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-earth-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 bg-earth-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-earth-700">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-earth-900 truncate">{user?.name}</p>
              <p className="text-xs text-earth-500 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-earth-400 hover:text-clay-600 transition-colors" title="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-earth-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-earth-600 hover:bg-earth-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <div className="text-sm text-earth-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
