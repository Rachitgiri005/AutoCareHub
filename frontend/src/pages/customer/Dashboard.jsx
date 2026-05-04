import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ upcoming: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated API fetch for presentation purposes
    setTimeout(() => {
      setStats({ upcoming: 1, completed: 3 });
      setLoading(false);
    }, 600);
  }, []);

  return (
    <div className="page page-wrap">
      <div className="page-hd">
        <div>
          <h1 className="sec-title">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="sec-sub">Here is an overview of your vehicle activity.</p>
        </div>
        <Link to="/book" className="btn btn-primary">➕ Book New Service</Link>
      </div>

      <div className="stat-grid" style={{ marginBottom: "32px" }}>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Upcoming Appointments</div>
          <div className="stat-value">{loading ? "-" : stats.upcoming}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Completed Services</div>
          <div className="stat-value">{loading ? "-" : stats.completed}</div>
        </div>
      </div>

      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "var(--dark)" }}>Recent Activity</h3>
        {stats.upcoming > 0 ? (
          <div style={{ border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: "700", color: "var(--dark)" }}>Full Synthetic Oil Change</div>
              <div style={{ fontSize: "13px", color: "var(--text-m)" }}>Scheduled for next week</div>
            </div>
            <Link to="/appointments" className="btn btn-outline btn-sm">View</Link>
          </div>
        ) : (
          <div className="empty">
            <div className="empty-icon">🚙</div>
            <h3>No activity yet</h3>
            <p>You haven't booked any services. Ready to get started?</p>
            <br/>
            <Link to="/book" className="btn btn-outline">Book your first service</Link>
          </div>
        )}
      </div>
    </div>
  );
}