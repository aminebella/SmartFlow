'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '@/styles/admin/dashboard/StatusDonut.module.css';
import dashboardService from '@/services/dashboardAdminService';

const STATUS_MAP = {
  ACTIVE: { label: 'Actifs', color: '#3b82f6' },
  FINISHED: { label: 'Terminés', color: '#22c55e' },
  ARCHIVED: { label: 'Archivé', color: '#6b7280' },
};

export default function StatusDonut() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    dashboardService
      .getSummary()
      .then((summary) => {
        if (!mounted) return;
        const byStatus = summary?.projectsByStatus || {};
        const items = Object.keys(STATUS_MAP).map((k) => ({
          key: k,
          label: STATUS_MAP[k].label,
          value: byStatus[k] || 0,
          color: STATUS_MAP[k].color,
        }));
        const tot = items.reduce((s, it) => s + (it.value || 0), 0);
        setData(items);
        setTotal(tot);
      })
      .catch((err) => {
        console.error('StatusDonut: failed to load summary', err);
        if (mounted) setError('Impossible de charger la répartition');
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  if (loading) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Répartition Statuts</h3>
        <div style={{height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Répartition Statuts</h3>
        <div style={{padding: 12, color: 'red'}}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Répartition Statuts</h3>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={58} outerRadius={80}
              startAngle={90} endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((s) => (
                <Cell key={s.key} fill={s.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, name) => [`${v} projets`, name]}
              contentStyle={{ borderRadius: 8, fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className={styles.center}>
          <span className={styles.centerValue}>{total}</span>
          <span className={styles.centerLabel}>projets</span>
        </div>
      </div>

      {/* Legend */}
      <ul className={styles.legend}>
        {data.map((s) => (
          <li key={s.key} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: s.color }} />
            <span className={styles.legendLabel}>{s.label}</span>
            <span className={styles.legendValue}>{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
