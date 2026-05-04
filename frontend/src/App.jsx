import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Public pages (Fixed Paths)
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Customer pages
import Dashboard from "./pages/customer/Dashboard";
import BookService from "./pages/customer/BookService";
import MyAppointments from "./pages/customer/MyAppointments";
import AppointmentDetail from "./pages/customer/AppointmentDetail";
import MyInvoices from "./pages/customer/MyInvoices";
import Profile from "./pages/customer/Profile";
import MyReviews from "./pages/customer/MyReviews";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminServices from "./pages/admin/AdminServices";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInvoices from "./pages/admin/AdminInvoices";
import AdminReviews from "./pages/admin/AdminReviews";

// Guards
const Private = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};
const AdminOnly = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};
const GuestOnly = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function AppShell() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />

          {/* Customer */}
          <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
          <Route path="/book" element={<Private><BookService /></Private>} />
          <Route path="/appointments" element={<Private><MyAppointments /></Private>} />
          <Route path="/appointments/:id" element={<Private><AppointmentDetail /></Private>} />
          <Route path="/invoices" element={<Private><MyInvoices /></Private>} />
          <Route path="/profile" element={<Private><Profile /></Private>} />
          <Route path="/reviews" element={<Private><MyReviews /></Private>} />

          {/* Admin */}
          <Route path="/admin" element={<AdminOnly><AdminDashboard /></AdminOnly>} />
          <Route path="/admin/appointments" element={<AdminOnly><AdminAppointments /></AdminOnly>} />
          <Route path="/admin/services" element={<AdminOnly><AdminServices /></AdminOnly>} />
          <Route path="/admin/users" element={<AdminOnly><AdminUsers /></AdminOnly>} />
          <Route path="/admin/invoices" element={<AdminOnly><AdminInvoices /></AdminOnly>} />
          <Route path="/admin/reviews" element={<AdminOnly><AdminReviews /></AdminOnly>} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3500} theme="light" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}
