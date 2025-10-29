import { User } from '@/types/User';
import { PencilIcon } from '@heroicons/react/24/outline';
import { LockButton } from './LockButton';
import { UnlockButton } from './UnlockButton';
import styles from './UserTable.module.css';

export function UserTable({
  users,
  onEditUser,
  onLockAccount,
  onUnlockAccount,
}: {
  users: User[];
  onEditUser: (user: User) => void;
  onLockAccount: (user: User) => void;
  onUnlockAccount: (user: User) => void;
}) {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>User Information</th>
            <th className={styles.th}>Email</th>
            <th className={styles.thCenter}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {users.length === 0 ? (
            <tr>
              <td className={styles.emptyState}>No users found</td>
            </tr>
          ) : (
            users.map(u => (
              <tr key={u.username} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.stackedCell}>
                    {u.nickname ? (
                      <>
                        <div className={styles.nicknameRow}>
                          <span className={styles.primaryText}>
                            {u.nickname}
                          </span>
                          <span
                            className={`${styles.badge} ${
                              u.role === 'admin'
                                ? styles.badgeAdmin
                                : styles.badgeMember
                            }`}
                          >
                            {u.role || 'member'}
                          </span>
                        </div>
                        <span className={styles.secondaryText}>
                          @{u.username}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className={styles.nicknameRow}>
                          <span className={styles.primaryText}>
                            {u.username}
                          </span>
                          <span
                            className={`${styles.badge} ${
                              u.role === 'admin'
                                ? styles.badgeAdmin
                                : styles.badgeMember
                            }`}
                          >
                            {u.role || 'member'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </td>
                <td className={styles.td}>
                  <span className={styles.emailText}>{u.email}</span>
                </td>
                <td className={styles.tdCenter}>
                  <div className={styles.actionButtons}>
                    <button
                      onClick={() => onEditUser(u)}
                      className={styles.editButton}
                      aria-label={`Edit user ${u.username}`}
                      title="Edit user"
                    >
                      <PencilIcon className={styles.icon} />
                    </button>
                    {u.is_locked ? (
                      <UnlockButton user={u} onUnlock={onUnlockAccount} />
                    ) : (
                      <LockButton user={u} onLock={onLockAccount} />
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
