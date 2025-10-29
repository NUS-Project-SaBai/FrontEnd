import { User } from '@/types/User';
import { LockOpenIcon } from '@heroicons/react/24/outline';
import styles from './UserTable.module.css';

export function LockButton({
  user,
  onLock,
}: {
  user: User;
  onLock: (user: User) => void;
}) {
  const handleClick = () => {
    const isConfirmed = confirm(
      `Do you really want to lock the account for ${user.nickname}, @${user.username}?`
    );
    if (isConfirmed) {
      onLock(user);
    }
  };

  return (
    <button
      className={styles.blockButton}
      onClick={handleClick}
      aria-label={`Lock account for ${user.username}`}
      title={`Lock ${user.nickname || user.username || 'user'} account`}
    >
      <LockOpenIcon className={styles.icon} />
    </button>
  );
}
