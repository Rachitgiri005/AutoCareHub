import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get("/appointments");
        setAppointments(data);
      } catch (error) {
        console.error("Failed to load appointments");
        // Mock data for presentation UI
        setAppointments([
          { _id: "1", serviceType: "Oil Change", date: "2026-05-10", status: "Pending", vehicleName: "Daily Driver" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="page page-wrap">
      <div className="page-hd">
        <div>
          <h1 className="sec-title">My Appointments</h1>
          <p className="sec-sub">Track your scheduled services and repair history.</p>
        </div>
        <Link to="/book" className="btn btn-primary">Book Service</Link>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Service ID</th>
              <th>Vehicle</th>
              <th>Service Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: "24px" }}>Loading...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: "24px" }}>No appointments found.</td></tr>
            ) : (
              appointments.map((apt) => (
                <tr key={apt._id}>
                  <td style={{ fontWeight: "600", color: "var(--dark)" }}>#{apt._id.slice(-6).toUpperCase()}</td>
                  <td>{apt.vehicleName}</td>
                  <td>{apt.serviceType}</td>
                  <td>{new Date(apt.date).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${apt.status.toLowerCase()}`}>{apt.status}</span></td>
                  <td>
                    <Link to={`/appointments/${apt._id}`} className="btn btn-outline btn-sm">Details</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}