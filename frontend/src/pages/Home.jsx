import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import NourishMap from '../components/Map';
import ListingCard from '../components/ListingCard';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../context/AuthContext';

const BHOPAL = [23.2130, 77.4284];

export default function Home() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('available');

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/listings?lat=${BHOPAL[0]}&lng=${BHOPAL[1]}&radius=20&status=${filter}`);
      setListings(data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  useSocket((event, data) => {
    if (event === 'listing:new') setListings(prev => [data, ...prev]);
    if (event === 'listing:claimed' || event === 'listing:unclaimed' || event === 'listing:completed') {
      setListings(prev => prev.map(l => l._id === data._id ? data : l));
    }
    if (event === 'listing:deleted') setListings(prev => prev.filter(l => l._id !== data.id));
  });

  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 40, padding: '20px 0' }}>
          <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>
            🌿 Rescue food. Feed hope.
          </h1>
          <p style={{ fontSize: 18, color: '#666', maxWidth: 500, margin: '0 auto 24px' }}>
            Connecting MANIT hostel messes, canteens &amp; wedding halls with volunteers to rescue surplus food — real-time, in Bhopal.
          </p>
          {!user && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link to="/register?role=donor"><button className="btn btn-primary">Post Surplus Food</button></Link>
              <Link to="/register?role=volunteer"><button className="btn btn-outline">Volunteer to Rescue</button></Link>
            </div>
          )}
        </div>

        {/* Live Map */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Live food map</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {['available', 'claimed', 'completed'].map(s => (
                <button
                  key={s}
                  className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFilter(s)}
                >{s}</button>
              ))}
            </div>
          </div>
          <NourishMap listings={listings} center={BHOPAL} />
        </div>

        {/* Listings grid */}
        <h2 className="section-title">{filter === 'available' ? 'Available now' : `${filter} listings`}</h2>
        {loading ? (
          <div className="spinner" />
        ) : listings.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40 }}>
            <p style={{ color: '#888', marginBottom: 12 }}>No {filter} listings right now.</p>
            {user?.role === 'donor' && <Link to="/create"><button className="btn btn-primary">Post Food Now</button></Link>}
          </div>
        ) : (
          <div className="grid-2">
            {listings.map(l => (
              <ListingCard key={l._id} listing={l} onUpdate={fetchListings} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
