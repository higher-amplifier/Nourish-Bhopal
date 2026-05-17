import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const QUICK_TEMPLATES = [
  { icon: '🍛', label: 'Mess Leftovers', title: 'MANIT Hostel Mess Surplus', foodType: 'cooked', unit: 'meals', qty: 50, hours: 1.5 },
  { icon: '🎊', label: 'Wedding Surplus', title: 'Wedding Banquet Surplus Food', foodType: 'cooked', unit: 'meals', qty: 200, hours: 2 },
  { icon: '🥘', label: 'Canteen Extra', title: 'Canteen End-of-Day Food', foodType: 'cooked', unit: 'meals', qty: 30, hours: 1 },
  { icon: '📦', label: 'Packaged Items', title: 'Packaged Food / Snacks', foodType: 'packaged', unit: 'packets', qty: 50, hours: 24 },
];

const BHOPAL_LOCATIONS = [
  { label: 'MANIT Bhopal – Hostel Area', lat: '23.2130', lng: '77.4284' },
  { label: 'MANIT Bhopal – Main Canteen', lat: '23.2145', lng: '77.4301' },
  { label: 'TT Nagar', lat: '23.2337', lng: '77.4011' },
  { label: 'MP Nagar', lat: '23.2389', lng: '77.4348' },
  { label: 'Arera Colony', lat: '23.2195', lng: '77.4475' },
  { label: 'Habibganj (Rani Kamlapati)', lat: '23.2279', lng: '77.4380' },
  { label: 'New Market', lat: '23.2375', lng: '77.4023' },
  { label: 'Ayodhya Nagar', lat: '23.2606', lng: '77.4614' },
  { label: 'Custom (enter below)', lat: '', lng: '' },
];

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', quantity: '', unit: 'meals',
    foodType: 'cooked', address: '', lat: '23.2130', lng: '77.4284',
    expiresInHours: 2,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locPreset, setLocPreset] = useState('MANIT Bhopal – Hostel Area');

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const applyTemplate = (t) => {
    setForm(f => ({ ...f, title: t.title, foodType: t.foodType, unit: t.unit, quantity: t.qty, expiresInHours: t.hours }));
  };

  const applyLocation = (loc) => {
    setLocPreset(loc.label);
    if (loc.lat) setForm(f => ({ ...f, lat: loc.lat, lng: loc.lng, address: loc.label }));
    else setForm(f => ({ ...f, address: '' }));
  };

  const getGPS = () => {
    navigator.geolocation.getCurrentPosition(
pos => setForm(f => ({
  ...f,
  lat: pos.coords.latitude.toString(),
  lng: pos.coords.longitude.toString(),
  address: 'Current GPS Location'
})),      () => alert('Could not get GPS location')
    );
  };

  const getCoordinatesFromAddress = async (address) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );

    const data = await res.json();

    if (data && data.length > 0) {
      return {
        lat: data[0].lat,
        lng: data[0].lon,
      };
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const submit = async (e) => {
  e.preventDefault();

  let updatedForm = { ...form };

  // Convert custom address into coordinates
  if (
    form.address &&
    (!form.lat || !form.lng || locPreset === 'Custom (enter below)')
  ) {
    const coords = await getCoordinatesFromAddress(form.address);

    if (!coords) {
      return setError('Address not found');
    }

    updatedForm.lat = coords.lat;
    updatedForm.lng = coords.lng;
  }

  if (!updatedForm.lat || !updatedForm.lng) {
    return setError('Please set a location');
  }

  setError('');
  setLoading(true);

  try {
    await api.post('/listings', {
  ...updatedForm,
  quantity: Number(updatedForm.quantity),

  location: {
    type: 'Point',
    coordinates: [
      Number(updatedForm.lng),
      Number(updatedForm.lat),
    ],
  },
});
    navigate('/dashboard');
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to post listing');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <img src="https://www.manit.ac.in/sites/default/files/manit_logo.png" alt="MANIT"
            style={{ width: 42, height: 42, borderRadius: 6, padding: 3, background: '#1a3c5e', objectFit: 'contain' }}
            onError={e => e.target.style.display = 'none'} />
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Post Surplus Food</h1>
            <p style={{ color: '#666', fontSize: 13 }}>Hello {user?.name} — let's rescue some food today 🌿</p>
          </div>
        </div>

        {/* Quick templates */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: '#666', marginBottom: 10 }}>QUICK TEMPLATES</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {QUICK_TEMPLATES.map(t => (
              <button key={t.label} type="button" className="btn btn-outline"
                style={{ flexDirection: 'column', padding: '10px 8px', fontSize: 12, textAlign: 'center', lineHeight: 1.4 }}
                onClick={() => applyTemplate(t)}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={submit}>
            <div className="form-group">
              <label>Listing title</label>
              <input name="title" value={form.title} onChange={handle}
                placeholder="e.g. MANIT Mess Leftover – Lunch" required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input name="quantity" type="number" min="1" value={form.quantity} onChange={handle}
                  placeholder="e.g. 80" required />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select name="unit" value={form.unit} onChange={handle}>
                  <option value="meals">Meals / Plates</option>
                  <option value="kg">Kilograms</option>
                  <option value="packets">Packets</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Food type</label>
                <select name="foodType" value={form.foodType} onChange={handle}>
                  <option value="cooked">Cooked food</option>
                  <option value="packaged">Packaged / sealed</option>
                  <option value="raw">Raw ingredients</option>
                  <option value="bakery">Bakery / sweets</option>
                </select>
              </div>
              <div className="form-group">
                <label>Pickup window</label>
                <select name="expiresInHours" value={form.expiresInHours} onChange={handle}>
                  <option value={0.5}>30 minutes</option>
                  <option value={1}>1 hour</option>
                  <option value={1.5}>1.5 hours</option>
                  <option value={2}>2 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={24}>24 hours (packaged)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description (optional)</label>
              <textarea name="description" value={form.description} onChange={handle} rows={2}
                placeholder="Any details — type of food, allergens, quantity breakdown..." />
            </div>

            {/* Location picker */}
            <div className="form-group">
              <label>Pickup location</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {BHOPAL_LOCATIONS.map(loc => (
                  <button key={loc.label} type="button"
                    onClick={() => applyLocation(loc)}
                    style={{
                      padding: '5px 12px', borderRadius: 999, fontSize: 12, border: '1px solid',
                      borderColor: locPreset === loc.label ? '#1D9E75' : '#e5e7eb',
                      background: locPreset === loc.label ? '#E1F5EE' : '#fff',
                      color: locPreset === loc.label ? '#085041' : '#444', cursor: 'pointer',
                    }}>
                    {loc.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input name="address" value={form.address} onChange={handle}
                  placeholder="Full address / landmark" required />
                <button type="button" className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }} onClick={getGPS}>
                  📍 GPS
                </button>
              </div>
            </div>

            {/* Preview */}
            {form.title && (
              <div style={{ background: '#E1F5EE', borderRadius: 8, padding: '12px 16px', marginBottom: 16, fontSize: 13 }}>
                <strong>Preview:</strong> {form.title} · {form.quantity} {form.unit} · pickup within {form.expiresInHours}h
              </div>
            )}

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
              {loading ? 'Posting...' : '🌿 Post food listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
