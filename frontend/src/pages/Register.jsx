import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", formData);
      // login(data);
      login(data.user, data.token);
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-wrap" style={{ maxWidth: "450px", margin: "60px auto" }}>
      <div className="card" style={{ padding: "36px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "8px", textAlign: "center", color: "var(--dark)" }}>
          Create an Account
        </h2>
        <p style={{ color: "var(--text-m)", textAlign: "center", marginBottom: "28px", fontSize: "14px" }}>
          Join AutoCare Hub to simplify your auto maintenance.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input 
              type="text" 
              className="input" 
              required 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          <div className="form-group">
            <label className="label">Email Address</label>
            <input 
              type="email" 
              className="input" 
              required 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input" 
              required 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: "16px" }}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-m)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--primary)", fontWeight: "700" }}>Log In</Link>
        </div>
      </div>
    </div>
  );
}