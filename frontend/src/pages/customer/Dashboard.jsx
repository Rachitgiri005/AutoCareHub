import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/appointments");
        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcoming = appointments.filter(a => ["Pending", "Confirmed", "In Progress"].includes(a.status));
  const completed = appointments.filter(a => a.status === "Completed");

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
          <div className="stat-value">{loading ? "-" : upcoming.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Completed Services</div>
          <div className="stat-value">{loading ? "-" : completed.length}</div>
        </div>
      </div>

      <div className="card" style={{ padding: "24px" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "var(--dark)" }}>Recent Activity</h3>
        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-m)" }}>Loading...</p>
        ) : upcoming.length > 0 ? (
          upcoming.slice(0, 3).map(apt => (
            <div key={apt._id} style={{ border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <div style={{ fontWeight: "700", color: "var(--dark)" }}>{apt.serviceName}</div>
                <div style={{ fontSize: "13px", color: "var(--text-m)" }}>{new Date(apt.date).toLocaleDateString()} at {apt.timeSlot}</div>
              </div>
              <Link to="/appointments" className="btn btn-outline btn-sm">View</Link>
            </div>
          ))
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