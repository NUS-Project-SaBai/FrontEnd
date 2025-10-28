'use client';

import { UserFormModal } from '@/components/accounts/UserFormModal';
import { UserTable } from '@/components/accounts/UserTable';
import { Button } from '@/components/Button';
import { LoadingPage } from '@/components/LoadingPage';
import { createUser, getUsers, updateUser } from '@/data/user';
import { useLoadingState } from '@/hooks/useLoadingState';
import type { User } from '@/types/User';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

type UserFormValues = Omit<User, 'id'> & {
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
    withLoading(async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        toast.error('Failed to load users');
        console.error('Error fetching users:', error);
      }
    }),
    [withLoading]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Open modal for creating new user
  const handleAddUser = () => {
    reset();
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

  // Handle hiding/deactivating user
  const handleHideUser = async () => {
    throw new Error('Not implemented yet');
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
      console.log('Updating user with values:', values);
      const { user, error } = await updateUser(
        modalState.user!.id.toString(),
        values
      );
      console.log('Update user response:', { user, error });
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

  return (
    <LoadingPage isLoading={isLoading} message="Loading users...">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Account Management
          </h1>
          <Button text="Add User" colour="green" onClick={handleAddUser} />
        </div>

        <UserTable
          users={users}
          onEditUser={handleEditUser}
          onHideUser={handleHideUser}
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
