import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const BADGE_EMOJI = { 'First Five': '🌱', 'Hunger Hero': '⭐', 'Food Guardian': '🏆' };

export default function Impact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/impact')
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">

        {/* Hero with Bhopal landmark feel */}
        <div style={{
          background: 'linear-gradient(160deg, #1a3c5e 0%, #1D9E75 60%, #085041 100%)',
          borderRadius: 16, padding: '40px 32px', marginBottom: 32, textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* MANIT logo */}
          <img src="https://www.manit.ac.in/sites/default/files/manit_logo.png" alt="MANIT Bhopal"
            style={{ width: 64, height: 64, borderRadius: 10, background: '#fff', padding: 5, objectFit: 'contain', marginBottom: 16 }}
            onError={e => e.target.style.display = 'none'} />
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>
            Nourish Bhopal 🌿
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, maxWidth: 480, margin: '0 auto 20px' }}>
            Real food rescued from MANIT hostel messes, college canteens, and wedding halls — delivered to those who need it most.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?role=volunteer">
              <button className="btn" style={{ background: '#fff', color: '#1D9E75', fontWeight: 600 }}>
                🚴 Volunteer to rescue
              </button>
            </Link>
            <Link to="/register?role=donor">
              <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)' }}>
                🍛 Post surplus food
              </button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        {loading ? <div className="spinner" /> : data && (
          <>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 20 }}>Our impact in Bhopal</h2>
            <div className="grid-4" style={{ marginBottom: 40 }}>
              <div style={{ background: 'linear-gradient(135deg, #E1F5EE, #b3edd8)', borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#085041' }}>{data.totalMeals.toLocaleString()}</div>
                <div style={{ fontSize: 14, color: '#1D9E75', marginTop: 6, fontWeight: 500 }}>🍽 Meals rescued</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #E6F1FB, #c0d9f5)', borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#0C447C' }}>{data.totalKg} <span style={{ fontSize: 20 }}>kg</span></div>
                <div style={{ fontSize: 14, color: '#378ADD', marginTop: 6, fontWeight: 500 }}>🌾 Food saved</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #EEEDFE, #d0cdfa)', borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#3C3489' }}>{data.totalCO2} <span style={{ fontSize: 20 }}>kg</span></div>
                <div style={{ fontSize: 14, color: '#534AB7', marginTop: 6, fontWeight: 500 }}>🌍 CO₂ avoided</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #FAEEDA, #f5d9a8)', borderRadius: 14, padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#854F0B' }}>{data.totalRescues}</div>
                <div style={{ fontSize: 14, color: '#EF9F27', marginTop: 6, fontWeight: 500 }}>🤝 Rescues done</div>
              </div>
            </div>

            {/* About section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 12 }}>🏫 Who we serve in Bhopal</h3>
                {[
                  ['🍛', 'MANIT Bhopal', 'Hostel messes & canteens rescuing daily leftovers'],
                  ['🎊', 'Wedding Halls', 'Banquet surplus from events across Bhopal'],
                  ['🏫', 'Colleges', 'NIT, RGPV, LNCT, Barkatullah canteens'],
                  ['🍽', 'Restaurants', 'Dhabas and restaurants in MP Nagar, TT Nagar'],
                ].map(([icon, name, desc]) => (
                  <div key={name} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 22 }}>{icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
                      <div style={{ fontSize: 13, color: '#666' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 12 }}>📍 Active zones in Bhopal</h3>
                {[
                  ['MANIT Campus', 'Hostel mess rescue zone'],
                  ['MP Nagar', 'Restaurant & wedding venues'],
                  ['TT Nagar', 'Banquet halls & caterers'],
                  ['Arera Colony', 'Residential & event rescue'],
                  ['Habibganj', 'Railway & commercial area'],
                ].map(([area, desc]) => (
                  <div key={area} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0', fontSize: 14 }}>
                    <span style={{ fontWeight: 500 }}>📍 {area}</span>
                    <span style={{ color: '#888', fontSize: 13 }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            {data.leaderboard?.length > 0 && (
              <div className="card" style={{ marginBottom: 40 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 18 }}>🏆 Top Volunteers in Bhopal</h3>
                {data.leaderboard.map((v, i) => (
                  <div key={v._id} className="lb-row">
                    <span className={`lb-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{v.name}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                        {v.badges?.map(b => (
                          <span key={b} style={{ fontSize: 12, background: '#FAEEDA', color: '#854F0B', padding: '1px 8px', borderRadius: 999 }}>
                            {BADGE_EMOJI[b] || '🏅'} {b}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 18, color: '#1D9E75' }}>{v.mealsRescued}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>meals</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div style={{
          background: '#E1F5EE', borderRadius: 14, padding: '28px 32px',
          textAlign: 'center', border: '1px solid #9FE1CB',
        }}>
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Join the movement in Bhopal 🌿</h2>
          <p style={{ color: '#555', marginBottom: 20 }}>
            Whether you run a hostel mess, are a MANIT student, or run an NGO — there's a role for you.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?role=donor"><button className="btn btn-primary">I have food to share</button></Link>
            <Link to="/register?role=volunteer"><button className="btn btn-outline">I want to volunteer</button></Link>
            <Link to="/register?role=ngo"><button className="btn btn-outline">Register my NGO</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
