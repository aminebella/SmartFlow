'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '@/styles/admin/dashboard/StatusDonut.module.css';

const statuses = [
  { label: 'En cours',  value: 20, color: '#3b82f6' },
  { label: 'Terminé',   value: 10, color: '#22c55e' },
  { label: 'En attente', value: 6, color: '#eab308' },
  { label: 'En retard',  value: 4, color: '#ef4444' },
];
const total = statuses.reduce((s, d) => s + d.value, 0);

export default function StatusDonut() {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Répartition Statuts</h3>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={statuses}
              cx="50%" cy="50%"
              innerRadius={58} outerRadius={80}
              startAngle={90} endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {statuses.map((s) => (
                <Cell key={s.label} fill={s.color} />
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
        {statuses.map((s) => (
          <li key={s.label} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: s.color }} />
            <span className={styles.legendLabel}>{s.label}</span>
            <span className={styles.legendValue}>{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
