import { adminApi } from '@/services/api/admin-api';
import { useEffect, useState } from 'react';
import type { User } from '@/types/user.types';

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    void adminApi
      .getUsers({ search, page: 1, pageSize: 50 })
      .then((result) => {
        if (mounted) setItems(result.data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [search]);

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-black">Users & Roles</h1>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, or phone"
        className="h-11 w-full max-w-md rounded-xl border border-border bg-background px-3"
      />
      <div className="rounded-2xl border border-border bg-card">
        {loading ? (
          <p className="p-4 text-sm text-muted-foreground">Loading users...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/40">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-3">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
