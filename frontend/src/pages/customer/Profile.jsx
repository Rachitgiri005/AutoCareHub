import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate profile update
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Profile updated successfully!");
      setFormData({ ...formData, currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-wrap" style={{ maxWidth: "600px" }}>
      <div className="page-hd">
        <div>
          <h1 className="sec-title">My Profile</h1>
          <p className="sec-sub">Update your account settings and preferences.</p>
        </div>
      </div>

      <div className="card" style={{ padding: "32px" }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Full Name</label>
            <input type="text" className="input" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="form-group">
            <label className="label">Email Address</label>
            <input type="email" className="input" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>

          <hr style={{ border: "0", borderTop: "1px solid var(--border)", margin: "24px 0" }} />
          <h3 style={{ fontSize: "16px", marginBottom: "16px", color: "var(--dark)" }}>Change Password (Optional)</h3>

          <div className="form-group">
            <label className="label">Current Password</label>
            <input type="password" className="input" placeholder="Leave blank to keep current" value={formData.currentPassword} onChange={(e) => setFormData({...formData, currentPassword: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="label">New Password</label>
            <input type="password" className="input" placeholder="New strong password" value={formData.newPassword} onChange={(e) => setFormData({...formData, newPassword: e.target.value})} />
          </div>

          <button type="submit" className="btn btn-dark" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}