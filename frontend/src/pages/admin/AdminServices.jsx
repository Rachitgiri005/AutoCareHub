import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", price: "", category: "", icon: "🔧" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    api.get("/services").then(({ data }) => setServices(data || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/services", form);
      setServices([...services, data]);
      toast.success("Service added!");
      setForm({ name: "", price: "", category: "", icon: "🔧" });
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add service.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
      toast.success("Service removed.");
    } catch (error) {
      toast.error("Failed to delete service.");
    }
  };

  return (
    <div className="page page-wrap">
      <div className="page-hd">
        <div>
          <h1 className="sec-title">Service Catalog</h1>
          <p className="sec-sub">Manage available services and pricing.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>➕ Add Service</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: "24px", marginBottom: "24px" }}>
          <form onSubmit={handleAdd}>
            <div className="form-row-2">
              <div className="form-group">
                <label className="label">Service Name</label>
                <input type="text" className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Price ($)</label>
                <input type="number" className="input" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label className="label">Category</label>
                <input type="text" className="input" required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="label">Icon (emoji)</label>
                <input type="text" className="input" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Save Service</button>
          </form>
        </div>
      )}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr><th>Service Name</th><th>Category</th><th>Price</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px" }}>Loading...</td></tr>
              : services.length === 0 ? <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px" }}>No services yet.</td></tr>
              : services.map((service) => (
                <tr key={service._id}>
                  <td style={{ fontWeight: "600", color: "var(--dark)" }}>{service.icon} {service.name}</td>
                  <td><span className="badge" style={{ background: "var(--bg)", color: "var(--text-s)" }}>{service.category}</span></td>
                  <td style={{ fontWeight: "700", color: "var(--primary)" }}>${Number(service.price).toFixed(2)}</td>
                  <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(service._id)}>Delete</button></td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}