import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page">
      {/* Hero Section */}
      <section style={{ background: "var(--dark)", color: "var(--white)", padding: "80px 24px", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontSize: "48px", fontWeight: "900", marginBottom: "16px", color: "var(--white)" }}>
            Premium Auto Care, <span style={{ color: "var(--primary)" }}>Simplified.</span>
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-l)", maxWidth: "600px", margin: "0 auto 32px" }}>
            Book appointments, track repairs, and manage your vehicle's health all in one professional platform.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Book a Service Now</Link>
                <Link to="/services" className="btn btn-outline btn-lg" style={{ color: "var(--white)", borderColor: "var(--text-m)" }}>View Services</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container" style={{ padding: "60px 24px" }}>
        <div className="sec-title" style={{ textAlign: "center", marginBottom: "40px" }}>Why Choose AutoCare Hub?</div>
        <div className="stat-grid">
          <div className="card" style={{ padding: "32px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚡</div>
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Instant Booking</h3>
            <p style={{ color: "var(--text-m)", fontSize: "14px" }}>Schedule your service in seconds with our real-time availability calendar.</p>
          </div>
          <div className="card" style={{ padding: "32px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🛠️</div>
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Expert Technicians</h3>
            <p style={{ color: "var(--text-m)", fontSize: "14px" }}>Your vehicle is handled by certified professionals with years of experience.</p>
          </div>
          <div className="card" style={{ padding: "32px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📱</div>
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>Digital Tracking</h3>
            <p style={{ color: "var(--text-m)", fontSize: "14px" }}>Track your repair status and view digital invoices directly from your dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
}