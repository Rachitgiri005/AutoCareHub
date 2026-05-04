import { useState } from "react";
import { toast } from "react-toastify";

export default function AdminServices() {
  const [services, setServices] = useState([
    { _id: "1", name: "Full Synthetic Oil Change", price: 49.99, category: "Maintenance" },
    { _id: "2", name: "Brake Pad Replacement", price: 129.99, category: "Repairs" }
  ]);

  const handleDelete = (id) => {
    setServices(services.filter(s => s._id !== id));
    toast.error("Service removed from catalog.");
  };

  return (
    <div className="page page-wrap">
      <div className="page-hd">
        <div>
          <h1 className="sec-title">Service Catalog</h1>
          <p className="sec-sub">Manage available services and pricing.</p>
        </div>
        <button className="btn btn-primary" onClick={() => toast.info("Add Service Modal coming soon!")}>➕ Add Service</button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service._id}>
                <td style={{ fontWeight: "600", color: "var(--dark)" }}>{service.name}</td>
                <td><span className="badge" style={{ background: "var(--bg)", color: "var(--text-s)" }}>{service.category}</span></td>
                <td style={{ fontWeight: "700", color: "var(--primary)" }}>${service.price.toFixed(2)}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button className="btn btn-outline btn-sm">Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(service._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}