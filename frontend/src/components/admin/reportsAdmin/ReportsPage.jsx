'use client';

import { useEffect, useState } from 'react';
import {
  Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, Legend,
} from 'recharts';
import styles from '@/styles/admin/reports/ReportsPage.module.css';
import reportsService from '@/services/reportsService';

const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState(null);

  // Generate year options (current year and 3 previous years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 4 }, (_, i) => currentYear - i);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    reportsService.getYearlyReport(selectedYear)
      .then((summary) => {
        if (!mounted) return;
        
        console.log('ReportsPage - received summary:', summary);
        
        // Build monthly series for the selected year
        const projectPoints = summary?.projectsActivity || [];
        const taskPoints = summary?.tasksActivity || [];

        console.log('Projects points:', projectPoints);
        console.log('Task points:', taskPoints);

        const mapProj = new Map(projectPoints.map(p => [p.month, p.count]));
        const mapTask = new Map(taskPoints.map(p => [p.month, p.count]));

        const series = Array.from({ length: 12 }, (_, i) => {
          const month = i + 1;
          return {
            month: MONTHS[i],
            projets: mapProj.get(month) || 0,
            taches: mapTask.get(month) || 0,
          };
        });

        setData(series);
      })
      .catch((err) => {
        console.error('ReportsPage: failed to load yearly report', err);
        if (mounted) setError('Impossible de charger le rapport');
      })
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [selectedYear]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Rapports</h2>
          <div className={styles.yearSelector}>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={styles.select}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.loading}>Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Rapports</h2>
          <div className={styles.yearSelector}>
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={styles.select}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Rapports</h2>
        <div className={styles.yearSelector}>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className={styles.select}
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Projets</div>
          <div className={styles.statValue}>
            {data.reduce((sum, item) => sum + item.projets, 0)}
          </div>
          <div className={styles.statSub}>{selectedYear}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Tâches</div>
          <div className={styles.statValue} style={{ color: '#E0A820' }}>
            {data.reduce((sum, item) => sum + item.taches, 0)}
          </div>
          <div className={styles.statSub}>{selectedYear}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Moyenne Mensuelle</div>
          <div className={styles.statValue} style={{ color: '#2D7A4F' }}>
            {Math.round(data.reduce((sum, item) => sum + item.projets, 0) / 12)}
          </div>
          <div className={styles.statSub}>Projets/mois</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Mois Actif</div>
          <div className={styles.statValue} style={{ color: '#4A52B8' }}>
            {data.filter(item => item.projets > 0).length}
          </div>
          <div className={styles.statSub}>Mois avec activité</div>
        </div>
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>
            Activité des Projets et Tâches — {selectedYear}
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradProjetsYear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#E0A820" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#E0A820" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EEE7" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#AAA' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#AAA' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #E5E3DC', fontSize: 12 }}
            />
            <Legend
              iconType="plainline"
              formatter={(v) => v === 'projets' ? 'Projets créés' : 'Tâches créées'}
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            />
            <Area
              type="monotone" dataKey="projets" name="projets"
              stroke="#E0A820" strokeWidth={2}
              fill="url(#gradProjetsYear)" dot={false} activeDot={{ r: 4 }}
            />
            <Line
              type="monotone" dataKey="taches" name="taches"
              stroke="#2D7A4F" strokeWidth={2} strokeDasharray="5 4"
              dot={false} activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
