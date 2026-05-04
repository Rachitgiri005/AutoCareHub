import { useState } from "react";

export default function AdminReviews() {
  const [reviews] = useState([
    { _id: "R-1", customer: "John Doe", service: "Oil Change", rating: 5, comment: "Excellent and fast service! Highly recommend.", date: "2026-05-01" },
    { _id: "R-2", customer: "Jane Smith", service: "Brake Inspection", rating: 4, comment: "Good service, but had to wait a bit longer than expected.", date: "2026-05-02" }
  ]);

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
        {reviews.map((rev) => (
          <div key={rev._id} className="card" style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <div>
                <h3 style={{ fontSize: "16px", color: "var(--dark)" }}>{rev.customer}</h3>
                <span style={{ fontSize: "12px", color: "var(--text-l)" }}>Service: {rev.service}</span>
              </div>
              <div style={{ fontSize: "14px" }}>{renderStars(rev.rating)}</div>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-s)", background: "var(--bg)", padding: "12px", borderRadius: "var(--radius-sm)", fontStyle: "italic" }}>
              "{rev.comment}"
            </p>
            <div style={{ textAlign: "right", marginTop: "12px", fontSize: "12px", color: "var(--text-l)" }}>
              {new Date(rev.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}