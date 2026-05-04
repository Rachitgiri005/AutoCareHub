import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Link } from "react-router-dom";

// Mock Data for the charts
const revenueData = [
  { name: "Mon", total: 400 }, { name: "Tue", total: 300 }, { name: "Wed", total: 550 },
  { name: "Thu", total: 450 }, { name: "Fri", total: 700 }, { name: "Sat", total: 800 }, { name: "Sun", total: 600 },
];
const appointmentData = [
  { time: "9 AM", count: 4 }, { time: "11 AM", count: 7 }, { time: "1 PM", count: 5 },
  { time: "3 PM", count: 8 }, { time: "5 PM", count: 3 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, appointments: 0, revenue: 0 });

  useEffect(() => {
    // Simulating API fetch
    setTimeout(() => setStats({ users: 142, appointments: 38, revenue: 3800 }), 500);
  }, []);

  return (
    <div className="page page-wrap">
      <div className="page-hd">
        <div>
          <h1 className="sec-title">Admin Overview</h1>
          <p className="sec-sub">Real-time platform analytics and management.</p>
        </div>
        <Link to="/admin/appointments" className="btn btn-outline">View All Appointments</Link>
      </div>

      <div className="stat-grid" style={{ marginBottom: "36px" }}>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{stats.users}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Active Appointments</div>
          <div className="stat-value">{stats.appointments}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Weekly Revenue</div>
          <div className="stat-value">${stats.revenue}</div>
        </div>
      </div>

      <div className="form-row-2">
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ marginBottom: "20px", fontSize: "16px", color: "var(--text-s)" }}>Weekly Revenue Trend</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip cursor={{ fill: "rgba(233, 69, 96, 0.1)" }} />
                <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ marginBottom: "20px", fontSize: "16px", color: "var(--text-s)" }}>Peak Appointment Times</h3>
          <div style={{ height: "300px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="var(--dark)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}