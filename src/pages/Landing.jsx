import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import logo from '../assets/logo.svg';

const APK_URL = 'https://expo.dev/artifacts/eas/7xd7jBHOh3AD561YK01P5_J-EPrbG6TXobWH2ekk_1o.apk';

const features = [
  { title: 'Personalized Conversations', desc: 'A companion that remembers your emotional patterns, tracks your progress, and adapts its support based on your unique journey.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg> },
  { title: 'Automatic Mood Tracking', desc: 'No manual logging needed. Your emotional state is understood from every conversation and visualized as actionable trends.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 5 4-9"/></svg> },
  { title: 'Guided Wellness Plans', desc: 'Breathing exercises, meditation, yoga, and CBT-based coping strategies — all tailored to your current stress and sleep patterns.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c4-4 8-7.5 8-12a8 8 0 1 0-16 0c0 4.5 4 8 8 12z"/><circle cx="12" cy="10" r="3"/></svg> },
  { title: 'Emergency SOS System', desc: 'One-touch emergency alerts with live location sharing. Works with our ESP32 hardware button when you cannot reach your phone.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  { title: 'Reflective Journaling', desc: 'Write freely and get sentiment insights, emotional patterns, and summaries that help you understand yourself better over time.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/></svg> },
  { title: 'Private & Encrypted', desc: 'Your mental health data stays yours. Secure authentication, encrypted storage, and privacy-first architecture throughout.', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1"/></svg> },
];

const principles = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, title: 'Listen First', desc: 'We validate your feelings before offering guidance. No toxic positivity, no dismissals — just genuine care.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: 'Learn Continuously', desc: 'Every interaction makes ThinkWell smarter about your specific needs and emotional patterns.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, title: 'Act Personally', desc: 'Recommendations, exercises, and insights are based on YOUR data — never generic one-size-fits-all advice.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-earth-50">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-earth-100 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-500 to-sage-700 rounded-xl flex items-center justify-center overflow-hidden p-1.5">
              <img src={logo} alt="ThinkWell" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <span className="text-xl font-bold text-earth-900">ThinkWell</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-earth-600 hover:text-earth-900 px-4 py-2 rounded-xl hover:bg-earth-100 transition-all">
              Log In
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-sage-50 border border-sage-200 rounded-full px-4 py-1.5 text-sm text-sage-700 font-medium mb-6">
            <span className="w-2 h-2 bg-sage-500 rounded-full animate-pulse"></span>
            Available on Android & Web
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-earth-900 leading-tight">
            Your mind deserves<br />
            <span className="text-sage-600">a companion that listens</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-earth-600 max-w-2xl mx-auto leading-relaxed">
            ThinkWell is a mental health companion that learns your emotional patterns, provides personalized CBT-based support, and grows with you over time. Not a chatbot — a relationship.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="btn-primary text-base px-8 py-4 shadow-lg hover:shadow-xl">
              Get Started — It's Free
            </Link>
            <a href="#download" className="btn-secondary text-base px-8 py-4">
              Download App ↓
            </a>
          </div>
          <p className="mt-4 text-sm text-earth-400">No credit card required. Free forever for personal use.</p>
        </div>
      </section>

      {/* Built Different */}
      <section className="py-16 px-6 bg-white border-y border-earth-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-earth-900">Not another wellness app</h2>
          <p className="text-earth-500 mt-4 text-lg max-w-2xl mx-auto">
            Most mental health apps offer generic content. ThinkWell is different — it reads your mood data, remembers your conversations, and provides support that is genuinely personalized to you.
          </p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-left">
              <div className="w-12 h-12 bg-earth-100 rounded-xl flex items-center justify-center mb-3 text-earth-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              </div>
              <h3 className="font-semibold text-earth-900">Generic apps</h3>
              <p className="text-sm text-earth-500 mt-1">Same advice for everyone. Static content. No memory of who you are.</p>
            </div>
            <div className="text-left">
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center mb-3 text-sage-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>
              </div>
              <h3 className="font-semibold text-sage-700">ThinkWell</h3>
              <p className="text-sm text-earth-500 mt-1">Learns YOUR patterns. Remembers context. Adapts daily to your needs.</p>
            </div>
            <div className="text-left">
              <div className="w-12 h-12 bg-earth-100 rounded-xl flex items-center justify-center mb-3 text-earth-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 3h-8l-2 4h12z"/><circle cx="12" cy="14" r="3"/></svg>
              </div>
              <h3 className="font-semibold text-earth-900">Hardware SOS</h3>
              <p className="text-sm text-earth-500 mt-1">Physical panic button powered by ESP32 for when you cannot use your phone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-earth-900">What ThinkWell does for you</h2>
            <p className="text-earth-500 mt-4 text-lg">Psychology-backed techniques, delivered through modern technology</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card hover:border-sage-200 group">
                <div className="w-12 h-12 bg-sage-50 border border-sage-100 rounded-xl flex items-center justify-center mb-4 text-sage-600 group-hover:bg-sage-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-earth-900 group-hover:text-sage-700 transition-colors">{f.title}</h3>
                <p className="text-sm text-earth-600 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-earth-900">Our approach</h2>
            <p className="text-earth-500 mt-4">Three principles that guide every interaction</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {principles.map((s, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-sage-50 border-2 border-sage-200 rounded-2xl mb-4 text-sage-600">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-earth-900">{s.title}</h3>
                <p className="text-sm text-earth-600 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Whom */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-earth-900">Built for real people</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { who: 'Students', why: 'Managing exam stress, academic pressure, and social anxiety' },
              { who: 'Working Professionals', why: 'Burnout recovery, work-life balance, and sleep improvement' },
              { who: 'Anyone feeling overwhelmed', why: 'A safe space to talk when you need support most' },
              { who: 'Caregivers & Families', why: 'Stay connected to loved ones with real-time SOS alerts' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-earth-100">
                <div className="w-8 h-8 bg-sage-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sage-600 text-xs font-bold">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-earth-900">{item.who}</p>
                  <p className="text-sm text-earth-500 mt-1">{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App */}
      <section className="py-20 px-6 bg-gradient-to-br from-sage-600 to-sage-700" id="download">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Take ThinkWell with you</h2>
          <p className="text-sage-100 mt-4 text-lg">Scan to download the Android app</p>
          <div className="mt-10 inline-flex flex-col items-center">
            <div className="bg-white rounded-2xl p-4 shadow-xl">
              <QRCodeSVG value={APK_URL} size={180} bgColor="#ffffff" fgColor="#345034" level="M" />
            </div>
            <a href={APK_URL} className="mt-6 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all backdrop-blur-sm">
              Or download directly ↓
            </a>
            <p className="text-sage-200 text-sm mt-4">Android available now • iOS coming soon</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-earth-900">Start your wellness journey today</h2>
          <p className="text-earth-500 mt-4 text-lg">Free, private, and always here when you need it.</p>
          <Link to="/register" className="inline-block mt-8 btn-primary text-lg px-10 py-4 shadow-lg">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-earth-900 text-earth-300 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sage-600 rounded-lg flex items-center justify-center overflow-hidden p-1">
              <img src={logo} alt="ThinkWell" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <span className="font-bold text-white">ThinkWell</span>
          </div>
          <p className="text-sm text-earth-500">&copy; 2025 ThinkWell. Built with care for your mental well-being.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
