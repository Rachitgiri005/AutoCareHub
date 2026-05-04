import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { to: "/services", label: "Services" },
  { to: "/about",    label: "About" },
  { to: "/contact",  label: "Contact" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const active = (to) => pathname === to || pathname.startsWith(to + "/");
  const handleLogout = () => { logout(); navigate("/login"); setOpen(false); };

  const navLinkStyle = (to) => ({
    color: active(to) ? "#E94560" : "#CCC",
    fontWeight: active(to) ? 700 : 400,
    fontSize: 14,
    transition: "color .15s",
    padding: "4px 2px",
    borderBottom: active(to) ? "2px solid #E94560" : "2px solid transparent",
  });

  return (
    <nav style={{ background: "#1A1A2E", position: "sticky", top: 0, zIndex: 200, boxShadow: "0 2px 20px rgba(0,0,0,.35)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
        {/* Brand */}
        <Link to="/" style={{ color: "#E94560", fontWeight: 900, fontSize: 20, letterSpacing: "-.5px", display: "flex", alignItems: "center", gap: 8 }}>
          🔧 AutoCare Hub
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }} className="desktop-nav">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} style={navLinkStyle(l.to)}>{l.label}</Link>
          ))}
          {user && <Link to="/dashboard" style={navLinkStyle("/dashboard")}>Dashboard</Link>}
          {user && <Link to="/appointments" style={navLinkStyle("/appointments")}>Appointments</Link>}
          {user?.role === "admin" && (
            <Link to="/admin" style={{ ...navLinkStyle("/admin"), color: active("/admin") ? "#E94560" : "#A78BFA" }}>
              ⚡ Admin
            </Link>
          )}

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link to="/profile" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#E94560", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: "#DDD", fontSize: 13 }}>{user.name?.split(" ")[0]}</span>
              </Link>
              <button onClick={handleLogout} style={{ border: "1px solid #444", color: "#CCC", padding: "6px 14px", borderRadius: 6, fontSize: 13, background: "none", cursor: "pointer" }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <Link to="/login" style={{ color: "#CCC", fontSize: 14, padding: "6px 12px" }}>Login</Link>
              <Link to="/register" style={{ background: "#E94560", color: "#fff", padding: "7px 18px", borderRadius: 6, fontSize: 13, fontWeight: 700 }}>Sign Up</Link>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(!open)} style={{ display: "none", color: "#fff", fontSize: 22, background: "none", border: "none", cursor: "pointer" }} className="hamburger">
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "#16213E", padding: "16px 24px 20px", borderTop: "1px solid #2A2A4A", display: "flex", flexDirection: "column", gap: 14 }}>
          {NAV_LINKS.map((l) => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{ color: "#CCC", fontSize: 15 }}>{l.label}</Link>)}
          {user && <Link to="/dashboard"    onClick={() => setOpen(false)} style={{ color: "#CCC", fontSize: 15 }}>Dashboard</Link>}
          {user && <Link to="/appointments" onClick={() => setOpen(false)} style={{ color: "#CCC", fontSize: 15 }}>Appointments</Link>}
          {user && <Link to="/invoices"     onClick={() => setOpen(false)} style={{ color: "#CCC", fontSize: 15 }}>Invoices</Link>}
          {user && <Link to="/profile"      onClick={() => setOpen(false)} style={{ color: "#CCC", fontSize: 15 }}>Profile</Link>}
          {user?.role === "admin" && <Link to="/admin" onClick={() => setOpen(false)} style={{ color: "#A78BFA", fontWeight: 700, fontSize: 15 }}>⚡ Admin Panel</Link>}
          {user
            ? <button onClick={handleLogout} style={{ border: "1px solid #444", color: "#CCC", padding: "8px 16px", borderRadius: 6, fontSize: 14, background: "none", width: "fit-content" }}>Logout</button>
            : <>
                <Link to="/login"    onClick={() => setOpen(false)} style={{ color: "#CCC", fontSize: 15 }}>Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} style={{ background: "#E94560", color: "#fff", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700, width: "fit-content" }}>Sign Up</Link>
              </>
          }
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: block !important; }
        }
      `}</style>
    </nav>
  );
}