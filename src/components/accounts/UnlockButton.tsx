import { User } from '@/types/User';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import styles from './UserTable.module.css';

export function UnlockButton({
  user,
  onUnlock,
}: {
  user: User;
  onUnlock: (user: User) => void;
}) {
  const handleClick = () => {
    const isConfirmed = confirm(
      `Do you really want to unlock the account for ${user.nickname}, @${user.username}?`
    );
    if (isConfirmed) {
      onUnlock(user);
    }
  };

  return (
    <button
      className={styles.unblockButton}
      onClick={handleClick}
      aria-label={`Unlock account for ${user.username}`}
      title={`Unlock ${user.nickname || user.username || 'user'} account`}
    >
      <LockClosedIcon className={styles.icon} />
    </button>
  );
}
