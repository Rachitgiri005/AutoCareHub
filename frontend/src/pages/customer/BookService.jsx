import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

export default function BookService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleName: "", 
    vehicleMake: "",
    vehicleModel: "",
    serviceType: "Oil Change",
    date: "",
    notes: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/appointments", formData);
      toast.success("Appointment requested successfully!");
      navigate("/appointments");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-wrap" style={{ maxWidth: "700px" }}>
      <div className="page-hd">
        <div>
          <h1 className="sec-title">Book a Service</h1>
          <p className="sec-sub">Schedule your next maintenance or repair.</p>
        </div>
      </div>

      <div className="card" style={{ padding: "32px" }}>
        <form onSubmit={handleSubmit} className="form-row">
          
          <div className="form-group">
            <label className="label">Vehicle Name (Nickname)</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g., My Daily Driver, The SUV" 
              required 
              value={formData.vehicleName} 
              onChange={(e) => setFormData({...formData, vehicleName: e.target.value})} 
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="label">Vehicle Make</label>
              <input type="text" className="input" placeholder="e.g., Toyota" required value={formData.vehicleMake} onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="label">Vehicle Model & Year</label>
              <input type="text" className="input" placeholder="e.g., Camry 2020" required value={formData.vehicleModel} onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})} />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="label">Type of Service</label>
              <select className="select" value={formData.serviceType} onChange={(e) => setFormData({...formData, serviceType: e.target.value})}>
                <option value="Oil Change">Oil Change</option>
                <option value="Brake Inspection">Brake Inspection</option>
                <option value="Engine Diagnostics">Engine Diagnostics</option>
                <option value="Full Detailing">Full Detailing</option>
                <option value="Other">Other / Not Sure</option>
              </select>
            </div>
            <div className="form-group">
              <label className="label">Preferred Date</label>
              <input type="date" className="input" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Additional Notes or Symptoms</label>
            <textarea className="textarea" placeholder="E.g., The brakes are squeaking when I stop..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting Request..." : "Confirm Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}