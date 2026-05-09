// UserRow.jsx
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';

const formatDate = (d) => d
  ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  : '—';

const isBlocked  = (user) => user.accountLocked || !user.enabled;
const getStatus  = (user) => isBlocked(user) ? 'Bloqué' : 'Actif';

export default function UserRow({ user, onToggleBlock, actionLoading }) {
  const router  = useRouter();
  const busy    = actionLoading === user.id;
  const blocked = isBlocked(user);

  return (
    <tr>
      {/* Identité */}
      <td>
        <div className="user-row-name">
          <Avatar
            src={user.profilePicture}
            name={user.fullName}
            size={36}
            className="av-user"
          />
          <div>
            <div className="user-name">{user.fullName}</div>
            <div className="user-sub">{(user.roles ?? ['CLIENT'])[0]}</div>
          </div>
        </div>
      </td>

      {/* Email */}
      <td style={{ color: '#454d6d', fontSize: 13 }}>{user.email}</td>

      {/* Post Title / Bio */}
      <td style={{ color: '#9099b4', fontSize: 12.5, maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {user.postTitle ?? '—'}
      </td>

      {/* Statut */}
      <td>
        <span className={`badge ${blocked ? 'badge-blocked' : 'badge-active'}`}>
          {getStatus(user)}
        </span>
      </td>

      {/* Date */}
      <td style={{ color: '#9099b4', fontSize: 12.5, whiteSpace: 'nowrap' }}>
        {formatDate(user.createdAt)}
      </td>

      {/* Actions */}
      <td>
        <div className="action-btns">
          {/* Voir */}
          <button
            className="btn-icon"
            title="Voir le profil"
            onClick={() => router.push(`/EspaceAdmin/users/${user.id}`)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          {/* Block / Unblock */}
          <button
            className={`btn-icon ${blocked ? 'success' : 'danger'}`}
            title={blocked ? 'Débloquer' : 'Bloquer'}
            onClick={() => onToggleBlock(user)}
            disabled={busy}
          >
            {busy ? (
              <span className="btn-spin" />
            ) : blocked ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}