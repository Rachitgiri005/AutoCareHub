import { useState } from "react";
import { toast } from "react-toastify";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call for presentation purposes
    setTimeout(() => {
      toast.success("Message sent successfully! We will contact you soon.");
      setLoading(false);
      e.target.reset();
    }, 1000);
  };

  return (
    <div className="page page-wrap">
      <div className="page-hd" style={{ textAlign: "center", justifyContent: "center", flexDirection: "column" }}>
        <h1 className="sec-title">Contact Us</h1>
        <p className="sec-sub">Have a question? We are here to help.</p>
      </div>

      <div className="form-row-2">
        <div className="card" style={{ padding: "32px" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "24px", color: "var(--dark)" }}>Send us a message</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Full Name</label>
              <input type="text" className="input" required placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="label">Email Address</label>
              <input type="email" className="input" required placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label className="label">Message</label>
              <textarea className="textarea" required placeholder="How can we help you today?"></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="card" style={{ padding: "32px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "var(--dark)" }}>Contact Information</h3>
            <p style={{ fontSize: "14px", color: "var(--text-s)", marginBottom: "12px" }}><strong>📍 Location:</strong> Brainybeam Info-Tech PVT LTD, Ahmedabad, Gujarat, India</p>
            <p style={{ fontSize: "14px", color: "var(--text-s)", marginBottom: "12px" }}><strong>📞 Phone:</strong> +1 800 AUTO CARE</p>
            <p style={{ fontSize: "14px", color: "var(--text-s)" }}><strong>📧 Email:</strong> admin@autocare.com</p>
          </div>
          <div className="card" style={{ padding: "32px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "var(--dark)" }}>Business Hours</h3>
            <p style={{ fontSize: "14px", color: "var(--text-s)", display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Monday - Friday</span> <span>8:00 AM - 6:00 PM</span></p>
            <p style={{ fontSize: "14px", color: "var(--text-s)", display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Saturday</span> <span>9:00 AM - 4:00 PM</span></p>
            <p style={{ fontSize: "14px", color: "var(--text-s)", display: "flex", justifyContent: "space-between" }}><span>Sunday</span> <span style={{ color: "var(--error)" }}>Closed</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}