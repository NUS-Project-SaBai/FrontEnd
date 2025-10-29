import { User } from '@/types/User';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '../Button';
import { RHFDropdown } from '../inputs/RHFDropdown';
import { RHFInputField } from '../inputs/RHFInputField';
import { Modal } from '../Modal';

type UserFormData = {
  username: string;
  nickname?: string;
  email: string;
  role: 'admin' | 'member';
  password?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export function UserFormModal({
  onSubmit,
  isOpen,
  setIsOpen,
  mode = 'create',
  user,
}: {
  onSubmit: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mode?: 'create' | 'edit';
  user?: User;
}) {
  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit User' : 'Add New User';

  const { reset, setValue } = useFormContext<UserFormData>();
  // Reset form with user data when modal opens in edit mode
  useEffect(() => {
    if (isOpen && user && isEditMode) {
      reset({
        username: user.username,
        nickname: user.nickname || '',
        email: user.email,
        role: user.role || 'member',
        password: '',
      });
    } else if (isOpen && !isEditMode) {
      reset();
    }
  }, [isOpen, user, isEditMode, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      ariaHideApp={false}
      title={title}
      text="Close"
      size="md"
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <RHFInputField
          name="username"
          type="text"
          placeholder="Username lowercase)"
          label="Username (lowercase only)"
          isRequired={true}
          onChange={e => {
            setValue('username', e.target.value.toLowerCase());
          }}
        />

        <RHFInputField
          name="nickname"
          type="text"
          placeholder="Nickname"
          label="Nickname"
          isRequired={true}
        />

        <RHFInputField
          name="email"
          type="email"
          placeholder="Email"
          label="Email"
          isRequired={true}
        />

        <RHFDropdown
          name="role"
          label="Role"
          isRequired={true}
          defaultValue={user?.role || 'member'}
          options={[
            { value: 'member', label: 'Member' },
            { value: 'admin', label: 'Admin' },
          ]}
        />

        {isEditMode && (
          <div className="rounded-md bg-blue-50 p-3">
            <p className="text-xs text-blue-800">
              Leave password fields empty to keep current password
            </p>
          </div>
        )}
        <RHFInputField
          name="password"
          type="password"
          placeholder="Password"
          label="Password"
          isRequired={isEditMode ? false : true}
          minLength={
            isEditMode
              ? undefined
              : {
                  value: 8,
                  message: 'Password must have at least 8 characters',
                }
          }
        />

        <div className="mt-2 flex gap-2">
          <Button text="Cancel" colour="red" onClick={() => setIsOpen(false)} />
          <Button
            type="submit"
            text={isEditMode ? 'Update' : 'Create'}
            colour="green"
          />
        </div>
      </form>
    </Modal>
  );
}
