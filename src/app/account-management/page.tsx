'use client';

import { Button } from '@/components/Button';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { createUser, getUsers } from '@/data/user';
import type { User } from '@/types/User';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function AccountManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // native dialog as a minimal modal
  const dialogRef = useRef<HTMLDialogElement>(null);

  // react-hook-form
  const useFormReturn = useForm<Omit<User, 'id' | 'role'>>();
  const { handleSubmit, reset } = useFormReturn;

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (values: Omit<User, 'id' | 'role'>) => {
    const created = await createUser(values); // let backend assign id
    setUsers(prev => [...prev, created]);
    reset();
    dialogRef.current?.close();
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>Account Management</h1>
        <Button
          onClick={() => dialogRef.current?.showModal()}
          text="Add User"
          colour="green"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Nickname</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.nickname}</td>
              <td>{u.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* minimal modal using native <dialog> */}
      <dialog ref={dialogRef} className="rounded border p-4">
        <FormProvider {...useFormReturn}>
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            <h2>Add New User</h2>

            <RHFInputField
              name="username"
              type="text"
              placeholder="Username"
              label="Username"
              isRequired={true}
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

            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <Button
                text="Cancel"
                onClick={() => dialogRef.current?.close()}
                colour="red"
              />
              <Button type="submit" text="Create" colour="green" />
            </div>
          </form>
        </FormProvider>
      </dialog>
    </div>
  );
}
