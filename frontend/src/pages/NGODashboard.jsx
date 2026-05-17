import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import NourishMap from '../components/Map';

const BHOPAL_CENTER = [23.2130, 77.4284];

export default function NGODashboard() {
  const { user } = useAuth();
  const [available, setAvailable] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [impact, setImpact] = useState({});
  const [tab, setTab] = useState('available');
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [avRes, clRes, impRes] = await Promise.all([
        api.get(`/listings?lat=${BHOPAL_CENTER[0]}&lng=${BHOPAL_CENTER[1]}&radius=20&status=available`),
        api.get('/claims/mine'),
        api.get('/impact'),
      ]);
      setAvailable(avRes.data);
      setMyClaims(clRes.data);
      setImpact(impRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return (
    <div className="page">
      <div className="container">
        <div style={{
          background: 'linear-gradient(135deg, #185FA5 0%, #378ADD 100%)',
          borderRadius: 14, padding: '22px 28px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>{user?.name} 🏥</div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>NGO Dashboard · Bhopal Food Network</div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>{myClaims.filter(l => l.status === 'claimed').length}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>active claims</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 22 }}>{available.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>available now</div>
            </div>
          </div>
        </div>

        {/* City impact */}
        <div className="grid-4" style={{ marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-num">{impact.totalMeals || 0}</div>
            <div className="stat-label">City meals rescued</div>
          </div>
          <div style={{ background: '#E6F1FB', borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#0C447C' }}>{impact.totalKg || 0} kg</div>
            <div style={{ fontSize: 13, color: '#378ADD', marginTop: 4 }}>Food saved</div>
          </div>
          <div style={{ background: '#EEEDFE', borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#3C3489' }}>{impact.totalCO2 || 0} kg</div>
            <div style={{ fontSize: 13, color: '#534AB7', marginTop: 4 }}>CO₂ avoided</div>
          </div>
          <div style={{ background: '#FAEEDA', borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 600, color: '#854F0B' }}>{impact.totalRescues || 0}</div>
            <div style={{ fontSize: 13, color: '#EF9F27', marginTop: 4 }}>Total rescues</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #e5e7eb', paddingBottom: 12 }}>
          {[['available', '🟢 Available Now'], ['map', '🗺 Map View'], ['claims', '✅ Our Claims']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              className={`btn btn-sm ${tab === val ? 'btn-primary' : 'btn-outline'}`}>{label}</button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {tab === 'available' && (
              available.length === 0
                ? <div className="card" style={{ textAlign: 'center', padding: 40, color: '#888' }}>No available listings right now.</div>
                : <div className="grid-2">{available.map(l => <ListingCard key={l._id} listing={l} onUpdate={fetchAll} />)}</div>
            )}
            {tab === 'map' && <NourishMap listings={[...available, ...myClaims]} center={BHOPAL_CENTER} />}
            {tab === 'claims' && (
              myClaims.length === 0
                ? <div className="card" style={{ textAlign: 'center', padding: 40, color: '#888' }}>No claims yet.</div>
                : <div className="grid-2">{myClaims.map(l => <ListingCard key={l._id} listing={l} onUpdate={fetchAll} />)}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
