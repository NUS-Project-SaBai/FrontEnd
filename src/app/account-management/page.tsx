'use client';

import { createUser, getUsers } from '@/data/user';
import type { User } from '@/types/User';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function AccountManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // native dialog as a minimal modal
  const dialogRef = useRef<HTMLDialogElement>(null);

  // react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<User, 'id' | 'role'>>();

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
        <button onClick={() => dialogRef.current?.showModal()}>Add User</button>
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
      <dialog ref={dialogRef}>
        <form onSubmit={handleSubmit(onSubmit)} method="dialog">
          <h2>Add New User</h2>

          <input
            placeholder="Username"
            {...register('username', { required: true })}
          />
          {errors.username && <p>Username is required</p>}

          <input placeholder="Nickname" {...register('nickname')} />

          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: true })}
          />
          {errors.email && <p>Email is required</p>}

          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => dialogRef.current?.close()}>
              Cancel
            </button>
            <button type="submit">Create</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
