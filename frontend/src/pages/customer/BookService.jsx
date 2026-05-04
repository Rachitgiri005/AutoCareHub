import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

export default function BookService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    vehicleName: "", 
    vehicleYear: "",
    serviceName: "Oil Change",
    date: "",
    timeSlot: "",
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
            <label className="label">Vehicle Name</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g., My Daily Driver" 
              required 
              value={formData.vehicleName} 
              onChange={(e) => setFormData({...formData, vehicleName: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label className="label">Vehicle Year</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g., 2020" 
              value={formData.vehicleYear} 
              onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})} 
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="label">Type of Service</label>
              <select className="select" value={formData.serviceName} onChange={(e) => setFormData({...formData, serviceName: e.target.value})}>
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
            <label className="label">Time Slot</label>
            <select className="select" required value={formData.timeSlot} onChange={(e) => setFormData({...formData, timeSlot: e.target.value})}>
              <option value="">-- Select a time --</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Additional Notes</label>
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