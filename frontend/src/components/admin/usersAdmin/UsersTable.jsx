// UsersTable.jsx
import UserRow    from './UserRow';
import EmptyState from './EmptyState';

const COLUMNS = ['Nom Complet', 'Email', 'Intitulé de Poste', 'STATUT', "DATE D'INSCRIPTION", 'ACTIONS'];

export default function UsersTable({ users, onToggleBlock, actionLoading }) {
  return (
    <div className="au-table-wrap">
      <table className="au-table">
        <thead>
          <tr>
            {COLUMNS.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length}>
                <EmptyState />
              </td>
            </tr>
          ) : (
            users.map(user => (
              <UserRow
                key={user.id}
                user={user}
                onToggleBlock={onToggleBlock}
                actionLoading={actionLoading}
              />
            ))
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="au-pagination">
        <span>Affichage de {users.length} utilisateur{users.length !== 1 ? 's' : ''}</span>
        <span>Pagination à implémenter si nécessaire</span>
      </div>
    </div>
  );
}
