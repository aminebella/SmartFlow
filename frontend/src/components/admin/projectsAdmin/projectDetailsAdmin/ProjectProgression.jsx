'use client'

import styles from '@/styles/admin/projects/projectDetailsAdmin.module.css'

export default function ProjectProgression({ taskCount, tasksDone, progress }) {
  const getProgressColor = (progress) => {
    if (progress >= 75) return '#E0A820'  // Gold - Excellent progress
    if (progress >= 50) return '#F4C430'  // Light gold - Good progress
    if (progress >= 25) return '#FFE066'  // Lighter gold - Moderate progress
    return '#FFF3B2'  // Very light gold - Low progress
  }

  const getProgressLabel = (progress) => {
    if (progress >= 75) return 'Excellent Progress'
    if (progress >= 50) return 'Good Progress'
    if (progress >= 25) return 'Moderate Progress'
    return 'Just Started'
  }

  return (
    <div className={styles.progressionSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Project Progression</h3>
        <div className={styles.progressOverview}>
          <span className={styles.progressPercentage}>{progress || 0}%</span>
          <span className={styles.progressLabel}>{getProgressLabel(progress || 0)}</span>
        </div>
      </div>

      <div className={styles.progressCard}>
        {/* Main progress bar */}
        <div className={styles.mainProgressBar}>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${progress || 0}%`,
                backgroundColor: getProgressColor(progress || 0)
              }}
            />
          </div>
          <div className={styles.progressMarkers}>
            <span className={styles.marker}>0%</span>
            <span className={styles.marker}>25%</span>
            <span className={styles.marker}>50%</span>
            <span className={styles.marker}>75%</span>
            <span className={styles.marker}>100%</span>
          </div>
        </div>

        {/* Task statistics */}
        <div className={styles.taskStats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{taskCount || 0}</div>
            <div className={styles.statLabel}>Total Tasks</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statValue} style={{ color: getProgressColor(progress || 0) }}>
              {tasksDone || 0}
            </div>
            <div className={styles.statLabel}>Completed</div>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <div className={styles.statValue}>{(taskCount || 0) - (tasksDone || 0)}</div>
            <div className={styles.statLabel}>Remaining</div>
          </div>
        </div>

        {/* Progress indicators */}
        <div className={styles.progressIndicators}>
          <div className={styles.indicator}>
            <div 
              className={styles.indicatorDot}
              style={{ backgroundColor: getProgressColor(progress || 0) }}
            />
            <span className={styles.indicatorText}>
              {tasksDone || 0} of {taskCount || 0} tasks completed
            </span>
          </div>
          <div className={styles.indicator}>
            <div 
              className={styles.indicatorDot}
              style={{ 
                backgroundColor: (taskCount || 0) > 0 ? '#E0A820' : '#CCC'
              }}
            />
            <span className={styles.indicatorText}>
              {progress || 0}% overall completion rate
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
