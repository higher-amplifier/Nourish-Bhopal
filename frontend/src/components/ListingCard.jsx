import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const timeLeft = (exp) => {
  const diff = new Date(exp) - Date.now();
  if (diff <= 0) return { label: 'Expired', cls: 'timer-exp' };
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const cls = diff < 1800000 ? 'timer-warn' : 'timer-ok';
  return { label: h > 0 ? `${h}h ${m}m left` : `${m}m left`, cls };
};

export default function ListingCard({ listing, onUpdate }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const timer = timeLeft(listing.expiresAt);

  const claim = async () => {
    setLoading(true);
    try {
      await api.post(`/claims/${listing._id}`);
      onUpdate();
    } catch (e) {
      alert(e.response?.data?.message || 'Error claiming');
    } finally { setLoading(false); }
  };

  const unclaim = async () => {
    setLoading(true);
    try {
      await api.delete(`/claims/${listing._id}`);
      onUpdate();
    } catch (e) {
      alert(e.response?.data?.message || 'Error');
    } finally { setLoading(false); }
  };

  const confirm = async () => {
    setLoading(true);
    try {
      await api.put(`/listings/${listing._id}/confirm`);
      onUpdate();
    } catch (e) {
      alert(e.response?.data?.message || 'Error');
    } finally { setLoading(false); }
  };

  const remove = async () => {
    if (!confirm('Delete this listing?')) return;
    setLoading(true);
    try {
      await api.delete(`/listings/${listing._id}`);
      onUpdate();
    } catch (e) {
      alert(e.response?.data?.message || 'Error');
    } finally { setLoading(false); }
  };

  const isMyClaim = user && listing.claimedBy && listing.claimedBy._id === user._id;
  const isMyListing = user && listing.donor && listing.donor._id === user._id;

  return (
    <div className="listing-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>{listing.title}</div>
          <div className="meta">{listing.quantity} {listing.unit} · {listing.foodType}</div>
        </div>
        <span className={`badge badge-${listing.status}`}>{listing.status}</span>
      </div>

      {listing.description && (
        <p style={{ fontSize: 13, color: '#555', marginTop: 6 }}>{listing.description}</p>
      )}

      <div className="meta" style={{ marginTop: 6 }}>
        📍 {listing.address}
      </div>
      <div className="meta">
        🍽 By: {listing.donor?.name || 'Unknown'}
        {listing.donor?.phone && ` · 📞 ${listing.donor.phone}`}
      </div>

      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className={`timer ${timer.cls}`}>⏱ {timer.label}</span>
        {listing.claimedBy && (
          <span style={{ fontSize: 12, color: '#555' }}>Claimed by: {listing.claimedBy.name}</span>
        )}
      </div>

      <div className="actions">
        {/* Volunteer/NGO can claim available listings */}
        {user && ['volunteer', 'ngo'].includes(user.role) && listing.status === 'available' && (
          <button className="btn btn-primary btn-sm" onClick={claim} disabled={loading}>
            {loading ? '...' : 'Claim'}
          </button>
        )}

        {/* Volunteer/NGO can unclaim their own claims */}
        {isMyClaim && listing.status === 'claimed' && (
          <button className="btn btn-outline btn-sm" onClick={unclaim} disabled={loading}>
            Unclaim
          </button>
        )}

        {/* Donor confirms completed pickup */}
        {isMyListing && listing.status === 'claimed' && (
          <button className="btn btn-amber btn-sm" onClick={confirm} disabled={loading}>
            ✓ Confirm Pickup
          </button>
        )}

        {/* Donor can delete available listings */}
        {isMyListing && listing.status === 'available' && (
          <button className="btn btn-danger btn-sm" onClick={remove} disabled={loading}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
