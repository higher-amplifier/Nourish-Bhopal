import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';

const STATUS_TABS = ['available', 'claimed', 'completed', 'expired'];

export default function DonorDashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('available');

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/listings/my');
      setListings(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const filtered = listings.filter(l => l.status === tab);
  const totalMeals = listings.filter(l => l.status === 'completed').reduce((s, l) => s + l.quantity, 0);
  const active = listings.filter(l => l.status === 'available').length;
  const claimed = listings.filter(l => l.status === 'claimed').length;

  return (
    <div className="page">
      <div className="container">

        {/* Header with MANIT branding */}
        <div style={{
          background: 'linear-gradient(135deg, #1a3c5e 0%, #1D9E75 100%)',
          borderRadius: 14, padding: '24px 28px', marginBottom: 28,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img src="https://www.manit.ac.in/sites/default/files/manit_logo.png" alt="MANIT"
              style={{ width: 56, height: 56, borderRadius: 8, background: '#fff', padding: 4, objectFit: 'contain' }}
              onError={e => e.target.style.display = 'none'} />
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>Welcome, {user?.name} 👋</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>
                MANIT Bhopal Food Rescue · Donor Dashboard
              </div>
            </div>
          </div>
          <Link to="/create">
            <button className="btn" style={{ background: '#fff', color: '#1D9E75', fontWeight: 600 }}>
              + Post Surplus Food
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 28 }}>
          <div className="stat-card">
            <div className="stat-num">{totalMeals}</div>
            <div className="stat-label">Meals rescued</div>
          </div>
          <div style={{ background: '#E6F1FB', borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#0C447C' }}>{listings.length}</div>
            <div style={{ fontSize: 13, color: '#378ADD', marginTop: 4 }}>Total posts</div>
          </div>
          <div style={{ background: '#FAEEDA', borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#854F0B' }}>{claimed}</div>
            <div style={{ fontSize: 13, color: '#EF9F27', marginTop: 4 }}>Being picked up</div>
          </div>
          <div style={{ background: '#EEEDFE', borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#3C3489' }}>{active}</div>
            <div style={{ fontSize: 13, color: '#534AB7', marginTop: 4 }}>Active now</div>
          </div>
        </div>

        {/* Tip banner */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 14 }}>
          💡 <strong>Tip:</strong> Post mess leftovers <strong>30 minutes before closing</strong> so volunteers have time to pick up. Wedding surplus should be posted as soon as the event ends.
        </div>

        {/* Tabs + Listings */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {STATUS_TABS.map(s => (
            <button key={s} onClick={() => setTab(s)}
              className={`btn btn-sm ${tab === s ? 'btn-primary' : 'btn-outline'}`}>
              {s} {listings.filter(l => l.status === s).length > 0 && `(${listings.filter(l => l.status === s).length})`}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> :
          filtered.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
              <p style={{ color: '#888', marginBottom: 12 }}>
                {tab === 'available' ? 'No active listings. Post your first one!' : `No ${tab} listings yet.`}
              </p>
              {tab === 'available' && <Link to="/create"><button className="btn btn-primary">Post Food Now</button></Link>}
            </div>
          ) : (
            <div className="grid-2">
              {filtered.map(l => <ListingCard key={l._id} listing={l} onUpdate={fetch} />)}
            </div>
          )
        }
      </div>
    </div>
  );
}
