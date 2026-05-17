import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { value: 'donor', emoji: '🍛', label: 'Donor', desc: 'Hostel mess, college canteen, wedding hall, restaurant — I have food to share' },
  { value: 'volunteer', emoji: '🚴', label: 'Student Volunteer', desc: 'I want to pick up surplus food and deliver it to those in need' },
  { value: 'ngo', emoji: '🏥', label: 'NGO / Shelter', desc: 'We are an organisation that collects and distributes food in Bhopal' },
];

const DONOR_TYPES = [
  'MANIT Bhopal Hostel Mess',
  'MANIT Canteen',
  'College Mess (Other)',
  'Wedding Hall / Banquet',
  'Restaurant / Dhaba',
  'Corporate Cafeteria',
  'Other',
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', address: '',
    role: params.get('role') || '',
    lat: '23.2130', lng: '77.4284',
    donorType: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locLoading, setLocLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const getLocation = () => {
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(f => ({ ...f, lat: pos.coords.latitude.toString(), lng: pos.coords.longitude.toString() }));
        setLocLoading(false);
      },
      () => { alert('Could not get location. Using MANIT Bhopal default.'); setLocLoading(false); }
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.role) return setError('Please select your role');
    setError(''); setLoading(true);
    try {
      const payload = { ...form };
      if (form.role === 'donor' && form.donorType) payload.name = form.donorType === 'Other' ? form.name : form.name;
      await register(payload);
      navigate(form.role === 'donor' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 540 }}>
        {/* MANIT Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #1a3c5e 0%, #1D9E75 100%)',
          borderRadius: 12, padding: '20px 24px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <img
            src="https://www.manit.ac.in/sites/default/files/manit_logo.png"
            alt="MANIT Bhopal"
            style={{ width: 52, height: 52, borderRadius: 8, background: '#fff', padding: 4, objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Nourish × MANIT Bhopal</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
              Fighting food waste in hostels, canteens & weddings across Bhopal
            </div>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Join Nourish 🌿</h2>
          <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>Create your account — takes 60 seconds</p>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Role selector */}
          <div className="form-group">
            <label>I am a...</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ROLES.map(r => (
                <div
                  key={r.value}
                  onClick={() => setForm(f => ({ ...f, role: r.value }))}
                  style={{
                    border: `2px solid ${form.role === r.value ? '#1D9E75' : '#e5e7eb'}`,
                    borderRadius: 8, padding: '12px 16px', cursor: 'pointer',
                    background: form.role === r.value ? '#E1F5EE' : '#fff',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{r.emoji} {r.label}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={submit}>
            {form.role === 'donor' && (
              <div className="form-group">
                <label>Donor type</label>
                <select name="donorType" value={form.donorType} onChange={handle} required>
                  <option value="">Select your establishment</option>
                  {DONOR_TYPES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>{form.role === 'donor' ? 'Contact person name' : 'Full name'}</label>
                <input name="name" value={form.name} onChange={handle} placeholder="eg: Bharat meghwal" required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input name="phone" value={form.phone} onChange={handle} placeholder="735 770 2 770" />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handle}
                placeholder={form.role === 'donor' ? 'mess@manit.ac.in' : 'you@example.com'} required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handle} placeholder="Min 6 characters" required />
            </div>

            <div className="form-group">
              <label>Address / Location</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input name="address" value={form.address} onChange={handle}
                  placeholder={form.role === 'donor' ? 'MANIT Bhopal, Hostel Block A' : 'Your area in Bhopal'} required />
                <button type="button" className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={getLocation}>
                  {locLoading ? '...' : '📍 Use GPS'}
                </button>
              </div>
              <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>
                GPS used for map pin · Bhopal area default if skipped
              </p>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#666' }}>
            Already have an account? <Link to="/login" style={{ color: '#1D9E75', fontWeight: 500 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
