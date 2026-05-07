'use client';

import styles from '@/styles/client/globalDashboard/DashboardDonut.module.css';

/**
 * Renders a pure-SVG donut chart showing task distribution.
 * No external library needed.
 *
 * Props:
 *  done        – number of DONE tasks
 *  inProgress  – number of IN_PROGRESS tasks
 *  todo        – number of TODO tasks
 *  total       – total tasks (done + inProgress + todo)
 */
export default function DashboardDonut({ done, inProgress, todo, total }) {
  if (total === 0) return null;

  // SVG donut parameters
  const R    = 38;          // radius
  const CX   = 50;          // centre x
  const CY   = 50;          // centre y
  const CIRC = 2 * Math.PI * R; // circumference ≈ 238.76

  const segments = [
    { label: 'Terminées',  value: done,       color: '#639922' },
    { label: 'En cours',   value: inProgress, color: '#B8860B' },
    { label: 'À faire',    value: todo,       color: '#D85A30' },
  ];

  // Build stroke-dasharray / stroke-dashoffset for each segment
  let offset = 0; // current rotation offset (starts at 12 o'clock = -25% of circ)
  const arcs = segments.map(seg => {
    const fraction = seg.value / total;
    const dash     = fraction * CIRC;
    const gap      = CIRC - dash;
    const result   = { ...seg, dash, gap, offset: -(offset) };
    offset += dash;
    return result;
  });

  const productivity = Math.round((done / total) * 100);

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Répartition des tâches</h3>

      <div className={styles.inner}>
        {/* SVG donut */}
        <div className={styles.svgWrap}>
          <svg viewBox="0 0 100 100" width="110" height="110">
            {/* Background track */}
            <circle
              cx={CX} cy={CY} r={R}
              fill="none"
              stroke="#F0EEE8"
              strokeWidth="14"
            />

            {arcs.map((arc, i) => (
              <circle
                key={i}
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={arc.color}
                strokeWidth="14"
                strokeDasharray={`${arc.dash} ${arc.gap}`}
                strokeDashoffset={arc.offset - CIRC * 0.25} /* rotate to 12 o'clock */
                style={{ transition: 'stroke-dasharray 0.5s ease' }}
              />
            ))}

            {/* Centre label */}
            <text x={CX} y={CY - 4} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1A1A1A">
              {productivity}%
            </text>
            <text x={CX} y={CY + 9} textAnchor="middle" fontSize="7" fill="#8A857F">
              complété
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          {segments.map(seg => (
            <div key={seg.label} className={styles.legendItem}>
              <div className={styles.dot} style={{ background: seg.color }} />
              <span className={styles.legendLabel}>{seg.label}</span>
              <span className={styles.legendCount}>{seg.value}</span>
            </div>
          ))}
          <div className={styles.legendItem} style={{ marginTop: '4px', paddingTop: '6px', borderTop: '0.5px solid #F0EEE8' }}>
            <span className={styles.legendLabel} style={{ color: '#1A1A1A', fontWeight: 600 }}>Total</span>
            <span className={styles.legendCount} style={{ fontWeight: 600 }}>{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
