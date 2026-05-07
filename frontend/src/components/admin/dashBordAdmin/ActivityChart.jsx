'use client';

import { useEffect, useState } from 'react';
import {
  Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, Legend,
} from 'recharts';
import styles from '@/styles/admin/dashboard/ActivityChart.module.css';
import dashboardService from '@/services/dashboardAdminService';

export default function ActivityChart() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('Activité des Projets');
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    dashboardService.getSummary()
      .then((summary) => {
        if (!mounted) return;
        // Build a daily series for the current month: days 1..N
        const dayPoints = summary?.projectsActivityDaily || [];
        const taskPoints = summary?.tasksActivityDaily || [];

        // Determine days in month from data or fallback to 30
        const maxDay = new Date().getDate();
        const mapProj = new Map(dayPoints.map(p => [p.day, p.count]));
        const mapTask = new Map(taskPoints.map(p => [p.day, p.count]));

        const series = Array.from({ length: maxDay }, (_, i) => {
          const day = i + 1;
          const dayLabel = day < 10 ? `0${day}` : `${day}`;
          return {
            day: dayLabel,
            projets: mapProj.get(day) || 0,
            taches: mapTask.get(day) || 0,
          };
        });

        setData(series);
        setTitle(`Activité des Projets — ${new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}`);
      })
      .catch((err) => {
        console.error('ActivityChart: failed to load summary', err);
        if (mounted) setError('Impossible de charger l\'activité');
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, []);

  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div style={{height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div style={{padding: 12, color: 'red'}}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{title}</h3>
        <a href="/EspaceAdmin/reports" className={styles.link}>Voir rapport →</a>
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
