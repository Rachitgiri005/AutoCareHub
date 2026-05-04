import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      login(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-wrap" style={{ maxWidth: "450px", margin: "60px auto" }}>
      <div className="card" style={{ padding: "32px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "8px", textAlign: "center" }}>
          Welcome Back
        </h2>
        <p style={{ color: "var(--text-m)", textAlign: "center", marginBottom: "24px", fontSize: "14px" }}>
          Log in to manage your appointments.
        </p>

        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: "12px" }}>
            {loading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--text-m)" }}>
          Don't have an account? <Link to="/register" style={{ color: "var(--primary)", fontWeight: "600" }}>Sign Up</Link>
        </div>
      </div>
    </div>
  );
}