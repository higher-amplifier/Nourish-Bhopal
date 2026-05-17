import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icons broken by webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const statusColor = { available: '#1D9E75', claimed: '#EF9F27', expired: '#888', completed: '#378ADD' };

const makeIcon = (status) => L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;border-radius:50%;background:${statusColor[status] || '#888'};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const timeLeft = (exp) => {
  const diff = new Date(exp) - Date.now();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
};

function RecenterMap({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function NourishMap({ listings, center = [26.9124, 75.7873] }) {
  return (
    <MapContainer center={center} zoom={13} className="map-wrap">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
      />
      <RecenterMap center={center} />
      {listings.map((l) => {
        const [lng, lat] = l.location.coordinates;
        return (
          <Marker key={l._id} position={[lat, lng]} icon={makeIcon(l.status)}>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong>{l.title}</strong>
                <p style={{ margin: '4px 0', fontSize: 13 }}>{l.quantity} {l.unit} · {l.foodType}</p>
                <p style={{ margin: '2px 0', fontSize: 12, color: '#666' }}>{l.address}</p>
                <span style={{ fontSize: 12, color: l.status === 'available' ? '#1D9E75' : '#EF9F27' }}>
                  {l.status === 'available' ? timeLeft(l.expiresAt) : l.status}
                </span>
                {l.donor && <p style={{ marginTop: 6, fontSize: 12 }}>By: {l.donor.name}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
