'use client';

import {
   Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, Legend,
} from 'recharts';
import styles from '@/styles/admin/dashboard/ActivityChart.module.css';

const data = [
  { day: '01', projets: 26, taches: 19 },
  { day: '03', projets: 28, taches: 21 },
  { day: '05', projets: 32, taches: 22 },
  { day: '07', projets: 35, taches: 23 },
  { day: '09', projets: 31, taches: 24 },
  { day: '11', projets: 40, taches: 25 },
  { day: '13', projets: 42, taches: 26 },
  { day: '15', projets: 43, taches: 26 },
  { day: '17', projets: 44, taches: 27 },
  { day: '19', projets: 45, taches: 28 },
  { day: '21', projets: 46, taches: 29 },
  { day: '23', projets: 48, taches: 30 },
];

export default function ActivityChart() {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>Activité des Projets — Mai 2026</h3>
        <a href="#" className={styles.link}>Voir rapport →</a>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradProjets" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
            labelFormatter={(v) => `Jour ${v}`}
          />
          <Legend
            iconType="plainline"
            formatter={(v) => v === 'projets' ? 'Projets créés' : 'Tâches closes'}
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          />
          <Area
            type="monotone" dataKey="projets" name="projets"
            stroke="#3b82f6" strokeWidth={2}
            fill="url(#gradProjets)" dot={false} activeDot={{ r: 4 }}
          />
          <Line
            type="monotone" dataKey="taches" name="taches"
            stroke="#22c55e" strokeWidth={2} strokeDasharray="5 4"
            dot={false} activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
