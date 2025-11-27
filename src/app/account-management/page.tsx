'use client';

import { UserFormModal } from '@/components/accounts/UserFormModal';
import { UserTable } from '@/components/accounts/UserTable';
import { Button } from '@/components/Button';
import { LoadingPage } from '@/components/LoadingPage';
import { createUser, getUsers, updateUser } from '@/data/user';
import { lockUser } from '@/data/user/lockUser';
import { unlockUser } from '@/data/user/unlockUser';
import { useLoadingState } from '@/hooks/useLoadingState';
import type { User } from '@/types/User';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type UserFormValues = Omit<User, 'id' | 'is_locked'> & {
  password?: string;
};

type ModalState = {
  isOpen: boolean;
  mode: 'create' | 'edit';
  user?: User;
};

const EMPTY_USER: UserFormValues = {
  username: '',
  nickname: '',
  email: '',
  role: 'member',
  password: '',
};
export default function AccountManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'locked'>(
    'all'
  );
  const { isLoading, withLoading } = useLoadingState(true);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'create',
  });

  // React Hook Form setup
  const useFormReturn = useForm<UserFormValues>({
    defaultValues: EMPTY_USER,
  });
  const { reset, handleSubmit } = useFormReturn;
  const fetchUsers = useCallback(
    () =>
      withLoading(async () => {
        try {
          const data = await getUsers();
          setUsers(data);
        } catch (error) {
          toast.error('Failed to load users');
          console.error('Error fetching users:', error);
        }
      })(),
    [withLoading]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Open modal for creating new user
  const handleAddUser = () => {
    reset(EMPTY_USER);
    setModalState({
      isOpen: true,
      mode: 'create',
    });
  };

  // Open modal for editing existing user
  const handleEditUser = (user: User) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      user,
    });
  };

  // Handle locking user account
  const handleLockAccount = async (user: User) => {
    lockUser(user.username)
      .then(() => {
        fetchUsers();
        toast.success(`User ${user.username} account has been locked`);
      })
      .catch(error => {
        console.error(`Failed to lock account for ${user.username}:`, error);
        toast.error(`Failed to lock account for ${user.username}`);
      });
  };

  // Handle unlocking user account
  const handleUnlockAccount = async (user: User) => {
    unlockUser(user.username)
      .then(() => {
        fetchUsers();
        toast.success(`User ${user.username} account has been unlocked`);
      })
      .catch(error => {
        console.error(`Failed to unlock account for ${user.username}:`, error);
        toast.error(`Failed to unlock account for ${user.username}`);
      });
  };

  // Close modal
  const closeModal = () => {
    setModalState({
      isOpen: false,
      mode: 'create',
    });
    reset();
  };

  // Handle creating a new user
  const handleCreateUser = withLoading(async (values: UserFormValues) => {
    try {
      const { user, error } = await createUser(values);
      if (error) {
        toast.error(`Failed to create user: ${error}`);
        return;
      }
      if (user) {
        toast.success(`User ${user.username} created successfully!`);
        setUsers(prev => [...prev, user]);
        closeModal();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error creating user:', error);
    }
  });

  // Handle updating an existing user
  const handleUpdateUser = withLoading(async (values: UserFormValues) => {
    try {
      const { user, error } = await updateUser(
        modalState.user!.id.toString(),
        values
      );
      if (error) {
        toast.error(`Failed to update user: ${error}`);
        return;
      }
      if (user) {
        toast.success(`User ${user.username} updated successfully!`);
        setUsers(prev => prev.map(u => (u.id === user.id ? user : u)));
        closeModal();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Error updating user:', error);
    }
  });

  // Handle form submission
  const onSubmit = handleSubmit(values => {
    if (modalState.mode === 'create') {
      handleCreateUser(values);
    } else {
      handleUpdateUser(values);
    }
  });

  // Filter users based on search query and status
  const filteredUsers = users.filter(user => {
    // Status filter
    if (statusFilter === 'active' && user.is_locked) return false;
    if (statusFilter === 'locked' && !user.is_locked) return false;

    // Search filter (case-insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesUsername = user.username.toLowerCase().includes(query);
      const matchesNickname = user.nickname?.toLowerCase().includes(query);
      const matchesName = user.name?.toLowerCase().includes(query);
      const matchesEmail = user.email.toLowerCase().includes(query);

      return matchesUsername || matchesNickname || matchesName || matchesEmail;
    }

    return true;
  });

  return (
    <LoadingPage isLoading={isLoading} message="Loading users...">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Account Management
          </h1>
          <Button text="Add User" colour="green" onClick={handleAddUser} />
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-4 flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, username, or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-48">
            <select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(e.target.value as 'all' | 'active' | 'locked')
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="locked">Locked</option>
            </select>
          </div>
        </div>

        <UserTable
          users={filteredUsers}
          onEditUser={handleEditUser}
          onLockAccount={handleLockAccount}
          onUnlockAccount={handleUnlockAccount}
        />

        <FormProvider {...useFormReturn}>
          <UserFormModal
            onSubmit={onSubmit}
            isOpen={modalState.isOpen}
            setIsOpen={open =>
              setModalState(prev => ({ ...prev, isOpen: open }))
            }
            mode={modalState.mode}
            user={modalState.user}
          />
        </FormProvider>
      </div>
    </LoadingPage>
  );
}
