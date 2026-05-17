import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import NourishMap from '../components/Map';
import { useSocket } from '../hooks/useSocket';

const BADGE_INFO = {
  'First Five': { emoji: '🌱', desc: 'Rescued 5+ meals' },
  'Hunger Hero': { emoji: '⭐', desc: 'Rescued 50+ meals' },
  'Food Guardian': { emoji: '🏆', desc: 'Rescued 200+ meals' },
};

const BHOPAL_CENTER = [23.2130, 77.4284];

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [available, setAvailable] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [tab, setTab] = useState('map');
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [avRes, clRes, impRes] = await Promise.all([
        api.get(`/listings?lat=${BHOPAL_CENTER[0]}&lng=${BHOPAL_CENTER[1]}&radius=15&status=available`),
        api.get('/claims/mine'),
        api.get('/impact'),
      ]);
      setAvailable(avRes.data);
      setMyClaims(clRes.data);
      setLeaderboard(impRes.data.leaderboard || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useSocket((event, data) => {
    if (event === 'listing:new') setAvailable(prev => [data, ...prev]);
    if (event === 'listing:claimed' || event === 'listing:unclaimed') {
      setAvailable(prev => prev.map(l => l._id === data._id ? data : l));
      fetchAll();
    }
  });

  const activeClaim = myClaims.find(l => l.status === 'claimed');

  return (
    <div className="page">
      <div className="container">

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1D9E75 0%, #085041 100%)',
          borderRadius: 14, padding: '22px 28px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>Hey {user?.name}! 🚴</div>
            <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14 }}>
              Volunteer Dashboard · Bhopal Food Rescue
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 24 }}>{user?.mealsRescued || 0}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>meals rescued</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.25)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 24 }}>{available.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>near you</div>
            </div>
          </div>
        </div>

        {/* Active claim alert */}
        {activeClaim && (
          <div className="alert alert-success" style={{ marginBottom: 20 }}>
            🎯 You've claimed: <strong>{activeClaim.title}</strong> — pick up from {activeClaim.address}.
            {activeClaim.donor?.phone && ` Call donor: ${activeClaim.donor.phone}`}
          </div>
        )}

        {/* Badges */}
        {user?.badges?.length > 0 && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            {user.badges.map(b => (
              <div key={b} style={{ background: '#FAEEDA', borderRadius: 8, padding: '8px 14px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 18 }}>{BADGE_INFO[b]?.emoji || '🏅'}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{b}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{BADGE_INFO[b]?.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #e5e7eb', paddingBottom: 12 }}>
          {[['map', '🗺 Live Map'], ['list', '📋 Available'], ['claims', '✅ My Claims'], ['board', '🏆 Leaderboard']].map(([val, label]) => (
            <button key={val} onClick={() => setTab(val)}
              className={`btn btn-sm ${tab === val ? 'btn-primary' : 'btn-outline'}`}>
              {label}
            </button>
          ))}
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            {tab === 'map' && (
              <div>
                <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>
                  Showing {available.length} available food listing(s) near MANIT Bhopal
                </p>
                <NourishMap listings={available} center={BHOPAL_CENTER} />
              </div>
            )}

            {tab === 'list' && (
              available.length === 0
                ? <div className="card" style={{ textAlign: 'center', padding: 40, color: '#888' }}>No available listings near you right now. Check back soon!</div>
                : <div className="grid-2">{available.map(l => <ListingCard key={l._id} listing={l} onUpdate={fetchAll} />)}</div>
            )}

            {tab === 'claims' && (
              myClaims.length === 0
                ? <div className="card" style={{ textAlign: 'center', padding: 40, color: '#888' }}>You haven't claimed any listings yet. Head to the map to find food!</div>
                : <div className="grid-2">{myClaims.map(l => <ListingCard key={l._id} listing={l} onUpdate={fetchAll} />)}</div>
            )}

            {tab === 'board' && (
              <div className="card">
                <h3 style={{ fontWeight: 600, marginBottom: 16 }}>🏆 Bhopal Top Rescuers</h3>
                {leaderboard.map((v, i) => (
                  <div key={v._id} className="lb-row">
                    <span className={`lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{v.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{v.badges?.join(' · ') || 'No badges yet'}</div>
                    </div>
                    <span style={{ fontWeight: 700, color: '#1D9E75' }}>{v.mealsRescued} meals</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
