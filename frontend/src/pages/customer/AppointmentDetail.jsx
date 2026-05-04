import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/api";

export default function AppointmentDetail() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    // Mocked detail fetch for presentation
    setAppointment({
      _id: id,
      vehicleName: "Daily Driver",
      vehicleMake: "Toyota",
      vehicleModel: "Camry 2020",
      serviceType: "Oil Change",
      date: "2026-05-10",
      notes: "Please check the tire pressure as well.",
      status: "Pending",
    });
  }, [id]);

  if (!appointment) return <div className="page-wrap">Loading...</div>;

  return (
    <div className="page page-wrap" style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link to="/appointments" style={{ color: "var(--text-m)", fontSize: "14px", fontWeight: "600" }}>
          ← Back to Appointments
        </Link>
      </div>

      <div className="card" style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--dark)" }}>Service Request #{appointment._id.slice(-6).toUpperCase()}</h2>
          <span className={`badge badge-${appointment.status.toLowerCase()}`}>{appointment.status}</span>
        </div>

        <div className="form-row-2">
          <div>
            <p className="label">Vehicle</p>
            <p style={{ fontSize: "15px", color: "var(--dark)", marginBottom: "16px", fontWeight: "500" }}>{appointment.vehicleName} ({appointment.vehicleMake} {appointment.vehicleModel})</p>
            
            <p className="label">Service Type</p>
            <p style={{ fontSize: "15px", color: "var(--dark)", marginBottom: "16px", fontWeight: "500" }}>{appointment.serviceType}</p>
          </div>
          <div>
            <p className="label">Scheduled Date</p>
            <p style={{ fontSize: "15px", color: "var(--dark)", marginBottom: "16px", fontWeight: "500" }}>{new Date(appointment.date).toLocaleDateString()}</p>
            
            <p className="label">Customer Notes</p>
            <p style={{ fontSize: "14px", color: "var(--text-s)", background: "var(--bg)", padding: "12px", borderRadius: "var(--radius-sm)" }}>
              {appointment.notes || "No additional notes provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}