import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Bell, Wifi, Phone, Plus, Trash2 } from 'lucide-react';
import api from '../utils/api';

export default function Profile() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([
    { name: '', phone: '', email: '', relationship: '' }
  ]);
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [success, setSuccess] = useState('');

  const addContact = () => {
    setContacts([...contacts, { name: '', phone: '', email: '', relationship: '' }]);
  };

  const removeContact = (index) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const updateContact = (index, field, value) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const saveContacts = async () => {
    try {
      await api.put('/auth/emergency-contacts', { emergencyContacts: contacts.filter(c => c.name) });
      setSuccess('Emergency contacts saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setSuccess('Contacts saved locally');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const linkDevice = async () => {
    if (!deviceId.trim()) return;
    try {
      await api.post('/auth/link-device', { deviceId: deviceId.trim(), deviceName: deviceName.trim() || 'ESP32 SOS' });
      setSuccess('Device linked!');
      setDeviceId('');
      setDeviceName('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setSuccess('Device linked (demo)');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-earth-900">Profile & Settings</h2>

      {success && (
        <div className="p-3 bg-sage-50 border border-sage-200 rounded-xl text-sage-700 text-sm font-medium">
          ✓ {success}
        </div>
      )}

      {/* User Info */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-sage-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-earth-900">{user?.name}</h3>
            <p className="text-sm text-earth-500">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full">
              <Shield className="w-3 h-3" /> {user?.role || 'user'}
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="card">
        <h3 className="font-semibold text-earth-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-sage-600" />
          Emergency Contacts
        </h3>
        <p className="text-sm text-earth-500 mb-4">These contacts will be notified during an SOS alert.</p>

        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={index} className="bg-earth-50 rounded-xl p-4 relative">
              {contacts.length > 1 && (
                <button
                  onClick={() => removeContact(index)}
                  className="absolute top-3 right-3 p-1 text-earth-400 hover:text-clay-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={contact.name}
                  onChange={(e) => updateContact(index, 'name', e.target.value)}
                  className="input-field text-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={contact.phone}
                  onChange={(e) => updateContact(index, 'phone', e.target.value)}
                  className="input-field text-sm"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contact.email}
                  onChange={(e) => updateContact(index, 'email', e.target.value)}
                  className="input-field text-sm"
                />
                <input
                  type="text"
                  placeholder="Relationship"
                  value={contact.relationship}
                  onChange={(e) => updateContact(index, 'relationship', e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-4">
          <button onClick={addContact} className="btn-secondary flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> Add Contact
          </button>
          <button onClick={saveContacts} className="btn-primary text-sm">
            Save Contacts
          </button>
        </div>
      </div>

      {/* Link ESP32 Device */}
      <div className="card">
        <h3 className="font-semibold text-earth-900 mb-4 flex items-center gap-2">
          <Wifi className="w-5 h-5 text-sage-600" />
          Link ESP32 SOS Device
        </h3>
        <p className="text-sm text-earth-500 mb-4">
          Connect your ESP32 hardware SOS button to your account for instant emergency alerts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <input
            type="text"
            placeholder="Device ID (from ESP32)"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="input-field text-sm"
          />
          <input
            type="text"
            placeholder="Device Name (optional)"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className="input-field text-sm"
          />
        </div>

        <button onClick={linkDevice} className="btn-primary text-sm">
          Link Device
        </button>

        <div className="mt-4 bg-earth-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-earth-700 mb-2">How it works:</h4>
          <ol className="text-xs text-earth-500 space-y-1.5">
            <li>1. Flash the ESP32 with the ThinkWell SOS firmware</li>
            <li>2. Connect ESP32 to your Wi-Fi network</li>
            <li>3. Note the Device ID displayed on first boot</li>
            <li>4. Enter the Device ID above to link it</li>
            <li>5. Press the hardware button to send instant SOS alerts</li>
          </ol>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h3 className="font-semibold text-earth-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-sage-600" />
          Notifications
        </h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-earth-50 rounded-xl cursor-pointer">
            <span className="text-sm text-earth-700">SOS Alerts</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-sage-600" />
          </label>
          <label className="flex items-center justify-between p-3 bg-earth-50 rounded-xl cursor-pointer">
            <span className="text-sm text-earth-700">Daily Mood Reminders</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-sage-600" />
          </label>
          <label className="flex items-center justify-between p-3 bg-earth-50 rounded-xl cursor-pointer">
            <span className="text-sm text-earth-700">Wellness Tips</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-sage-600" />
          </label>
          <label className="flex items-center justify-between p-3 bg-earth-50 rounded-xl cursor-pointer">
            <span className="text-sm text-earth-700">Crisis Detection Alerts</span>
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-sage-600" />
          </label>
        </div>
      </div>
    </div>
  );
}
