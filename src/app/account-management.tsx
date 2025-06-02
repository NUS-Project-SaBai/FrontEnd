import { useEffect, useState } from 'react';

type User = {
  id: string;
  username: string;
  nickname: string;
  email: string;
};

export default function AccountManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    nickname: '',
    email: '',
  });

  useEffect(() => {
    setLoading(true);
    // TODO: replace with real API call
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  const handleAddUser = () => {
    // TODO: replace with real API call
    const userToAdd = {
      ...newUser,
      id: Math.random().toString(36).substr(2, 9),
    };
    setUsers(prev => [...prev, userToAdd]);
    setNewUser({ username: '', nickname: '', email: '' });
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h1>Account Management</h1>

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

      <h2>Add New User</h2>
      <input
        type="text"
        placeholder="Username"
        value={newUser.username}
        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
      />
      <input
        type="text"
        placeholder="Nickname"
        value={newUser.nickname}
        onChange={e => setNewUser({ ...newUser, nickname: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
      />
      <button onClick={handleAddUser}>Add User</button>
    </div>
  );
}
