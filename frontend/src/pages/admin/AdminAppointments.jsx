import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([
    { _id: "APT-1001", customer: "John Doe", vehicle: "Toyota Camry", service: "Oil Change", date: "2026-05-10", status: "Pending" },
    { _id: "APT-1002", customer: "Jane Smith", vehicle: "Honda Civic", service: "Brake Inspection", date: "2026-05-11", status: "Confirmed" }
  ]);

  const updateStatus = (id, newStatus) => {
    setAppointments(appointments.map(apt => apt._id === id ? { ...apt, status: newStatus } : apt));
    toast.success(`Appointment ${id} marked as ${newStatus}`);
  };

  return (
    <div className="page page-wrap">
      <div className="page-hd">
        <div>
          <h1 className="sec-title">Manage Appointments</h1>
          <p className="sec-sub">Review and update customer service requests.</p>
        </div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Vehicle / Service</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt._id}>
                <td style={{ fontWeight: "700" }}>{apt._id}</td>
                <td>{apt.customer}</td>
                <td>
                  <div style={{ fontWeight: "600", color: "var(--dark)", fontSize: "13px" }}>{apt.vehicle}</div>
                  <div style={{ color: "var(--text-m)", fontSize: "12px" }}>{apt.service}</div>
                </td>
                <td>{new Date(apt.date).toLocaleDateString()}</td>
                <td><span className={`badge badge-${apt.status.toLowerCase()}`}>{apt.status}</span></td>
                <td>
                  <select 
                    className="select" 
                    style={{ width: "auto", padding: "6px", fontSize: "12px" }}
                    value={apt.status}
                    onChange={(e) => updateStatus(apt._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}