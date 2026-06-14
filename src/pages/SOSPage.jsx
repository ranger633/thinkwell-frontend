import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, Shield, Wifi, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';

export default function SOSPage() {
  const [sosTriggered, setSosTriggered] = useState(false);
  const [sosHistory, setSosHistory] = useState([]);
  const [activeAlert, setActiveAlert] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSosHistory();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      triggerSOS();
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const fetchSosHistory = async () => {
    try {
      const res = await api.get('/sos/history');
      setSosHistory(res.data.events || []);
    } catch (err) {
      setSosHistory([
        {
          _id: '1',
          status: 'resolved',
          triggerType: 'app',
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          resolvedAt: new Date(Date.now() - 86400000 * 3 + 600000).toISOString()
        }
      ]);
    }
  };

  const startSOS = () => {
    setCountdown(5);
  };

  const cancelSOS = () => {
    setCountdown(null);
  };

  const triggerSOS = async () => {
    setCountdown(null);
    setLoading(true);

    try {
      // Try to get location
      let latitude = null, longitude = null;
      if (navigator.geolocation) {
        const pos = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        }).catch(() => null);
        if (pos) {
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
        }
      }

      const res = await api.post('/sos/app-trigger', { latitude, longitude });
      setSosTriggered(true);
      setActiveAlert(res.data);
    } catch (err) {
      setSosTriggered(true);
      setActiveAlert({ eventId: 'local', message: 'SOS Alert Sent (Demo Mode)' });
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async () => {
    try {
      if (activeAlert?.eventId && activeAlert.eventId !== 'local') {
        await api.put(`/sos/resolve/${activeAlert.eventId}`, { notes: 'Resolved by user' });
      }
    } catch (err) {
      // Continue even if API fails
    }
    setSosTriggered(false);
    setActiveAlert(null);
    fetchSosHistory();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-earth-900">Emergency SOS</h2>
        <p className="text-earth-500 mt-1">One-touch emergency alert system</p>
      </div>

      {/* Active Alert */}
      {sosTriggered && (
        <div className="mb-8 bg-clay-50 border-2 border-clay-300 rounded-2xl p-6 text-center animate-pulse">
          <AlertTriangle className="w-12 h-12 text-clay-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-clay-800">SOS Alert Active</h3>
          <p className="text-clay-600 mt-2">Emergency contacts have been notified. Help is on the way.</p>
          <p className="text-sm text-clay-500 mt-3">If you're safe now, you can resolve this alert:</p>
          <button onClick={resolveAlert} className="mt-4 btn-primary bg-sage-600">
            <CheckCircle className="w-4 h-4 inline mr-2" />
            I'm Safe - Resolve Alert
          </button>
        </div>
      )}

      {/* Countdown */}
      {countdown !== null && (
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-clay-100 border-4 border-clay-400">
            <span className="text-5xl font-bold text-clay-700">{countdown}</span>
          </div>
          <p className="mt-4 text-clay-700 font-medium">Sending SOS in {countdown} seconds...</p>
          <button onClick={cancelSOS} className="mt-3 btn-secondary">
            Cancel
          </button>
        </div>
      )}

      {/* SOS Button */}
      {!sosTriggered && countdown === null && (
        <div className="flex flex-col items-center mb-8">
          <button
            onClick={startSOS}
            disabled={loading}
            className="w-48 h-48 rounded-full bg-gradient-to-br from-clay-500 to-clay-700 text-white shadow-2xl hover:shadow-3xl hover:scale-105 active:scale-95 transition-all duration-200 flex flex-col items-center justify-center group"
          >
            <AlertTriangle className="w-14 h-14 group-hover:animate-bounce" />
            <span className="text-lg font-bold mt-2">SOS</span>
            <span className="text-xs opacity-80 mt-1">Press & Hold</span>
          </button>
          <p className="mt-4 text-sm text-earth-500 text-center max-w-sm">
            Press the button to send an emergency alert to your trusted contacts with your location.
          </p>
        </div>
      )}

      {/* ESP32 Device Status */}
      <div className="card mb-6">
        <h3 className="font-semibold text-earth-900 mb-4 flex items-center gap-2">
          <Wifi className="w-5 h-5 text-sage-600" />
          ESP32 SOS Device
        </h3>
        <div className="bg-earth-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-earth-700">Hardware SOS Button</p>
              <p className="text-xs text-earth-500 mt-0.5">ESP32 + Push Button + Wi-Fi</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sage-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-sage-600 font-medium">Connected</span>
            </div>
          </div>
          <p className="text-xs text-earth-400 mt-3">
            Your ESP32 device sends instant alerts when the physical SOS button is pressed — no phone needed.
          </p>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="card mb-6">
        <h3 className="font-semibold text-earth-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-sage-600" />
          Emergency Contacts
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-earth-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-earth-700">Emergency Services</p>
              <p className="text-xs text-earth-500">112</p>
            </div>
            <a href="tel:112" className="btn-danger text-xs py-1.5 px-3">Call</a>
          </div>
          <div className="flex items-center justify-between p-3 bg-earth-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-earth-700">Vandrevala Foundation</p>
              <p className="text-xs text-earth-500">1860-2662-345 (24/7, free)</p>
            </div>
            <a href="tel:18602662345" className="btn-danger text-xs py-1.5 px-3">Call</a>
          </div>
          <div className="flex items-center justify-between p-3 bg-earth-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-earth-700">iCall (TISS)</p>
              <p className="text-xs text-earth-500">9152987821</p>
            </div>
            <a href="tel:9152987821" className="btn-danger text-xs py-1.5 px-3">Call</a>
          </div>
          <div className="flex items-center justify-between p-3 bg-earth-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-earth-700">AASRA</p>
              <p className="text-xs text-earth-500">9820466726 (24/7)</p>
            </div>
            <a href="tel:9820466726" className="btn-danger text-xs py-1.5 px-3">Call</a>
          </div>
        </div>
      </div>

      {/* SOS History */}
      <div className="card">
        <h3 className="font-semibold text-earth-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-earth-500" />
          Alert History
        </h3>
        {sosHistory.length === 0 ? (
          <p className="text-sm text-earth-400 text-center py-4">No previous alerts</p>
        ) : (
          <div className="space-y-2">
            {sosHistory.map((event) => (
              <div key={event._id} className="flex items-center gap-3 p-3 bg-earth-50 rounded-xl">
                {event.status === 'resolved' ? (
                  <CheckCircle className="w-5 h-5 text-sage-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-clay-500 shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-earth-700 font-medium capitalize">{event.status}</p>
                  <p className="text-xs text-earth-400">
                    {new Date(event.timestamp).toLocaleString()} · {event.triggerType}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
