'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList } from 'recharts';
import { StatsCard } from '@/components/shared/StatsCard';

interface AnalyticsData {
  jobsByState: Array<{ state: string; count: number }>;
  jobsBySector: Array<{ sector: string; count: number }>;
  placementFunnel: Array<{ name: string; value: number; fill: string }>;
  topCompanies: Array<{ name: string; jobs: number }>;
  topInstitutions: Array<{ name: string; apps: number }>;
  totals: { jobs: number; apps: number; shortlisted: number; selected: number; coordinators: number; recruiters: number };
}

const CHART_TOOLTIP_STYLE = { background: '#111827', border: '1px solid #1e293b', borderRadius: 8, color: '#f1f5f9', fontSize: '0.85rem' };

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(j => { if (j.success) setData(j.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Platform Analytics</h1>
        <p className="page-subtitle">Real-time placement data across all states, sectors, and institutions</p>
      </div>

      {/* Summary stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        <StatsCard icon="📋" label="Total Job Postings" value={data?.totals.jobs ?? 0} accent="blue" loading={loading} />
        <StatsCard icon="📥" label="Total Applications" value={data?.totals.apps ?? 0} accent="orange" loading={loading} />
        <StatsCard icon="✅" label="Students Shortlisted" value={data?.totals.shortlisted ?? 0} accent="green" loading={loading} />
        <StatsCard icon="🎉" label="Students Selected" value={data?.totals.selected ?? 0} accent="green" loading={loading} />
      </div>

      <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
        {/* Jobs by State */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontWeight: 700, marginBottom: 18 }}>Job Requirements by State</div>
          {loading ? <div className="skeleton" style={{ height: 220, borderRadius: 8 }} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={(data?.jobsByState || []).slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="state" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Jobs by Sector */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontWeight: 700, marginBottom: 18 }}>Job Requirements by Sector</div>
          {loading ? <div className="skeleton" style={{ height: 220, borderRadius: 8 }} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={(data?.jobsBySector || []).slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                <YAxis dataKey="sector" type="category" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} width={100} />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar dataKey="count" fill="#16A34A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Funnel & Top tables */}
      <div className="grid-2" style={{ gap: 24 }}>
        {/* Placement funnel */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontWeight: 700, marginBottom: 18 }}>Placement Conversion Funnel</div>
          {loading ? <div className="skeleton" style={{ height: 200, borderRadius: 8 }} /> : (
            <div>
              {(data?.placementFunnel || []).map((f, i) => (
                <div key={f.name} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{f.name}</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{f.value}</strong>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${data?.placementFunnel[0]?.value ? (f.value / data.placementFunnel[0].value) * 100 : 0}%`, background: f.fill, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Companies */}
        <div className="card" style={{ padding: '22px' }}>
          <div style={{ fontWeight: 700, marginBottom: 18 }}>Top Companies by Job Postings</div>
          {loading ? <div className="skeleton" style={{ height: 200, borderRadius: 8 }} /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(data?.topCompanies || []).slice(0, 8).map((c, i) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', width: 20, textAlign: 'right' }}>#{i + 1}</span>
                  <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{c.name}</span>
                  <span className="badge badge-blue">{c.jobs} jobs</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
