'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Leaflet must only load client-side
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(m => m.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

interface MapPoint {
  state: string;
  jobCount: number;
  totalSeats: number;
  lat: number;
  lng: number;
}

export default function GeoMap() {
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Import leaflet CSS client-side
    import('leaflet/dist/leaflet.css' as unknown as string).catch(() => {});
    
    fetch('/api/map')
      .then(r => r.json())
      .then(j => { if (j.success) setPoints(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="skeleton" style={{ height: 380, borderRadius: 12 }} />;

  const maxJobs = Math.max(...points.map(p => p.jobCount), 1);

  return (
    <div style={{ height: 380, borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {points.map(p => (
          <CircleMarker
            key={p.state}
            center={[p.lat, p.lng]}
            radius={6 + (p.jobCount / maxJobs) * 24}
            pathOptions={{
              fillColor: '#2563EB',
              fillOpacity: 0.7,
              color: '#60a5fa',
              weight: 1.5,
            }}
          >
            <Popup>
              <div style={{ color: '#0f172a', minWidth: 120 }}>
                <strong style={{ display: 'block', marginBottom: 4 }}>{p.state}</strong>
                <div>{p.jobCount} open job{p.jobCount !== 1 ? 's' : ''}</div>
                <div>{p.totalSeats} total seats</div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 14, right: 14, zIndex: 1000,
        background: 'rgba(15,23,42,0.92)', border: '1px solid #1e293b',
        borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ fontWeight: 700, marginBottom: 6, color: '#f1f5f9' }}>Open Jobs by State</div>
        <div style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563EB', opacity: 0.7 }} />
          Bubble size = job count
        </div>
        <div style={{ marginTop: 8, color: '#64748b' }}>
          {points.length} states with open jobs
        </div>
      </div>
    </div>
  );
}
