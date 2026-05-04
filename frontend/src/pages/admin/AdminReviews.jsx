import { useState, useEffect } from "react";
import api from "../../utils/api";

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/reviews").then(({ data }) => setReviews(data || []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const renderStars = (rating) => "⭐".repeat(rating);

  return (
    <div className="page page-wrap">
      <div className="page-hd">
        <div>
          <h1 className="sec-title">Customer Feedback</h1>
          <p className="sec-sub">Monitor reviews and satisfaction ratings.</p>
        </div>
      </div>
      <div className="form-row-2">
        {loading ? <p style={{ textAlign: "center" }}>Loading...</p>
          : reviews.length === 0 ? <p style={{ textAlign: "center", padding: "24px" }}>No reviews yet.</p>
          : reviews.map((rev) => (
            <div key={rev._id} className="card" style={{ padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", color: "var(--dark)" }}>{rev.user?.name || "Customer"}</h3>
                  <span style={{ fontSize: "12px", color: "var(--text-l)" }}>{renderStars(rev.rating)}</span>
                </div>
              </div>
              <p style={{ fontSize: "14px", color: "var(--text-s)", background: "var(--bg)", padding: "12px", borderRadius: "var(--radius-sm)", fontStyle: "italic" }}>"{rev.comment}"</p>
              <div style={{ textAlign: "right", marginTop: "12px", fontSize: "12px", color: "var(--text-l)" }}>{new Date(rev.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
      </div>
    </div>
  );
}