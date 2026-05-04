import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "#1A1A2E", color: "#AAA", padding: "48px 24px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 36, marginBottom: 36 }}>
          <div>
            <div style={{ color: "#E94560", fontWeight: 900, fontSize: 20, marginBottom: 14 }}>🔧 AutoCare Hub</div>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: "#888" }}>
              Professional auto service management platform. Book appointments, track repairs, get invoices — all in one place.
            </p>
            <p style={{ fontSize: 12, marginTop: 12, color: "#666" }}>Powered by Brainybeam Info-Tech PVT LTD</p>
          </div>

          <div>
            <h4 style={{ color: "#FFF", fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Quick Links</h4>
            {[["/ ","Home"],["/services","Services"],["/about","About Us"],["/contact","Contact"],["/register","Sign Up Free"]].map(([to, l]) => (
              <div key={to} style={{ marginBottom: 8 }}><Link to={to} style={{ color: "#888", fontSize: 13, transition: "color .15s" }}>{l}</Link></div>
            ))}
          </div>

          <div>
            <h4 style={{ color: "#FFF", fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Services</h4>
            {["Oil Change","Brake Service","Engine Diagnostic","AC Service","Wheel Alignment","Full Detailing"].map((s) => (
              <div key={s} style={{ marginBottom: 8, color: "#888", fontSize: 13 }}>{s}</div>
            ))}
          </div>

          <div>
            <h4 style={{ color: "#FFF", fontWeight: 700, marginBottom: 14, fontSize: 14 }}>Contact Us</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "#888" }}>
              <span>📧 admin@autocare.com</span>
              <span>📞 +1 800 AUTO CARE</span>
              <span>📍 Brainybeam Info-Tech PVT LTD, Ahmedabad, Gujarat, India</span>
              <span>🕐 Mon–Sat: 9:00 AM – 6:00 PM</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #2A2A4A", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#555" }}>
          <span>© {new Date().getFullYear()} AutoCare Hub · Brainybeam Info-Tech PVT LTD · All rights reserved.</span>
          <span>Built with ❤️ using MERN Stack — React · Node.js · Express · MongoDB</span>
        </div>
      </div>
    </footer>
  );
}