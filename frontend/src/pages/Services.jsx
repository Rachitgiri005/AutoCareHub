import { Link } from "react-router-dom";

export default function Services() {
  const servicesList = [
    { name: "Full Synthetic Oil Change", price: "$49.99", desc: "Includes up to 5 quarts of oil, filter change, and a 21-point inspection.", icon: "🛢️" },
    { name: "Brake Pad Replacement", price: "$129.99", desc: "Front or rear brake pad replacement with premium ceramic pads.", icon: "🛑" },
    { name: "Engine Diagnostics", price: "$89.99", desc: "Comprehensive computer diagnostic to identify check engine light issues.", icon: "💻" },
    { name: "Wheel Alignment", price: "$79.99", desc: "Laser-guided 4-wheel alignment to improve tire life and handling.", icon: "⚙️" },
    { name: "AC Service & Recharge", price: "$99.99", desc: "System pressure test, leak check, and refrigerant recharge.", icon: "❄️" },
    { name: "Premium Detailing", price: "$149.99", desc: "Interior vacuum, shampoo, exterior hand wash, clay bar, and wax.", icon: "✨" }
  ];

  return (
    <div className="page page-wrap">
      <div className="page-hd" style={{ textAlign: "center", justifyContent: "center", flexDirection: "column" }}>
        <h1 className="sec-title">Our Services</h1>
        <p className="sec-sub">Professional auto care services at transparent prices.</p>
      </div>

      <div className="stat-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {servicesList.map((service, index) => (
          <div key={index} className="card" style={{ padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{service.icon}</div>
              <h3 style={{ fontSize: "18px", color: "var(--dark)", marginBottom: "8px" }}>{service.name}</h3>
              <p style={{ fontSize: "14px", color: "var(--text-m)", marginBottom: "16px" }}>{service.desc}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--primary)" }}>{service.price}</span>
              <Link to="/register" className="btn btn-outline" style={{ padding: "6px 12px", fontSize: "13px" }}>Book Now</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}