'use client'

import styles from '@/styles/admin/projects/projectDetailsAdmin.module.css'

function formatCurrency(val) {
  if (val === null || val === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(val)
}

export default function ProjectBudget({ project }) {
  // TODO: fields = project.estimatedBudget, project.realBudget
  const estimated = project.estimatedBudget ?? null
  const real = project.realBudget ?? null

  const hasData = estimated !== null || real !== null

  // Percentages relative to estimated budget
  const realPct     = estimated && real ? Math.min(Math.round((real / estimated) * 100), 100) : null
  const reservedPct = realPct !== null ? 100 - realPct : null
  const isOver      = real !== null && estimated !== null && real > estimated
  const remaining   = estimated !== null && real !== null ? estimated - real : null

  return (
    <div className={styles.pdCard}>
      <div className={styles.cardHeader}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        Budget
      </div>

      {!hasData ? (
        <p className={styles.pdTextEmpty}>No budget data available.</p>
      ) : (
        <>
          {/* Two figures side by side */}
          <div className={styles.budgetMain}>
            <div className={styles.budgetFigure}>
              <div className={styles.statLabel}>Estimated budget</div>
              <div className={styles.budgetAmount}>{formatCurrency(estimated)}</div>
            </div>
            <div className={styles.budgetArrow}>→</div>
            <div className={styles.budgetFigure}>
              <div className={styles.statLabel}>Actual spent</div>
              <div className={`${styles.budgetAmount} ${isOver ? styles.budgetOver : ''}`}>
                {formatCurrency(real)}
              </div>
            </div>
          </div>

          {/* Stacked comparison bar */}
          {realPct !== null && (
            <div className={styles.budgetBarWrap}>
              <div className={styles.budgetBarLabels}>
                <span>Spent ({realPct}%)</span>
                <span>of {formatCurrency(estimated)}</span>
              </div>

              <div className={styles.budgetBar}>
                <div
                  className={`${styles.budgetFill} ${isOver ? styles.budgetFillOver : ''}`}
                  style={{ width: `${realPct}%` }}
                />
                <div
                  className={styles.budgetFillReserved}
                  style={{ width: `${reservedPct}%` }}
                />
              </div>

              <div className={styles.budgetLegend}>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: '#E0A820' }} />
                  Spent — {formatCurrency(real)}
                </div>
                <div className={styles.legendItem}>
                  <div className={styles.legendDot} style={{ background: '#FAC775' }} />
                  {isOver ? 'Over budget' : 'Remaining'} — {formatCurrency(Math.abs(remaining))}
                </div>
              </div>

              {isOver && (
                <div className={styles.budgetOverMsg}>
                  ⚠ Over budget by {formatCurrency(real - estimated)}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
