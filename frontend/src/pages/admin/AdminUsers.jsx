import { useState } from "react";

export default function AdminUsers() {
  const [users] = useState([
    { _id: "U-001", name: "System Admin", email: "admin@autocare.com", role: "admin", joined: "2024-01-01" },
    { _id: "U-002", name: "John Doe", email: "john@example.com", role: "customer", joined: "2026-05-01" }
  ]);

  return (
    <div className="page page-wrap">
      <div className="page-hd">
        <div>
          <h1 className="sec-title">User Management</h1>
          <p className="sec-sub">View and manage registered accounts.</p>
        </div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={{ fontWeight: "600" }}>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'badge-admin' : 'badge-confirmed'}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td>{new Date(u.joined).toLocaleDateString()}</td>
                <td><button className="btn btn-outline btn-sm">View Profile</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}