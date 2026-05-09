/**
 * TeamMembers — lists members of this specific project.
 * Path: src/components/client/projectDashboardClient/TeamMembers.jsx
 *
 * Props:
 *   members → dashboard.members  (array of MemberInfo)
 *             Each item: { clientId, fullName, postTitle, role, assignedTasks }
 */

// Avatar color pool — cycles through members deterministically
const AV_COLORS = ['av-gold', 'av-green', 'av-purple', 'av-warm', 'av-teal', 'av-rose'];

function getInitials(fullName) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getRoleBadge(role) {
  if (role === 'MANAGER') {
    return (
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        padding: '1px 6px',
        borderRadius: 4,
        background: 'var(--gold-bg)',
        color: 'var(--gold)',
        marginLeft: 5,
        verticalAlign: 'middle',
      }}>
        Manager
      </span>
    );
  }
  return null;
}

export default function TeamMembers({ members }) {
  // Empty state
  if (!members || members.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">Team Members</span>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>No members found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Team Members</span>
        <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600 }}>
          {members.length} member{members.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="card-body card-body-team">
        {members.map((m, i) => (
          <div className="team-member" key={m.clientId}>
            {/* Avatar with initials */}
            <div className={`av av-md ${AV_COLORS[i % AV_COLORS.length]}`}>
              {getInitials(m.fullName)}
            </div>

            {/* Name + job title */}
            <div className="team-member-info">
              <div className="team-member-name">
                {m.fullName}
                {getRoleBadge(m.role)}
              </div>
              <div className="team-member-role">
                {m.postTitle || '—'}
              </div>
            </div>

            {/* Task count */}
            <div className="team-member-tasks">
              {m.assignedTasks} task{m.assignedTasks !== 1 ? 's' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
