import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="page page-wrap" style={{ maxWidth: "800px" }}>
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ background: "var(--dark)", padding: "60px 24px", textAlign: "center" }}>
          <h1 style={{ color: "var(--white)", fontSize: "36px", fontWeight: "900", marginBottom: "12px" }}>About AutoCare Hub</h1>
          <p style={{ color: "var(--text-l)", fontSize: "16px", maxWidth: "500px", margin: "0 auto" }}>
            Driven by technology. Powered by Brainybeam Info-Tech PVT LTD.
          </p>
        </div>
        <div style={{ padding: "40px" }}>
          <h2 style={{ fontSize: "22px", color: "var(--dark)", marginBottom: "16px" }}>Our Mission</h2>
          <p style={{ color: "var(--text-s)", fontSize: "15px", marginBottom: "24px", lineHeight: "1.8" }}>
            We present a cloud-based digital platform for auto service shops that automates the full servicing and repair process. From appointment scheduling to invoicing and payment processing, we eliminate the friction of traditional auto repair.
          </p>
          
          <h2 style={{ fontSize: "22px", color: "var(--dark)", marginBottom: "16px" }}>The Modern Garage Experience</h2>
          <p style={{ color: "var(--text-s)", fontSize: "15px", marginBottom: "32px", lineHeight: "1.8" }}>
            Our platform allows you to book appointments, obtain quotations, and track the status of your vehicle repairs in real-time. We improve efficiency, lower costs, and provide a convenient, personalized experience for every driver on the road.
          </p>

          <div style={{ background: "var(--bg)", padding: "24px", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
            <h3 style={{ fontSize: "16px", color: "var(--dark)", marginBottom: "12px" }}>Ready to experience the difference?</h3>
            <Link to="/register" className="btn btn-primary">Create Your Free Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}