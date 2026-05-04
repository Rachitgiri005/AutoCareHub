import { useState } from "react";
import { toast } from "react-toastify";

export default function MyReviews() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ rating: "5", comment: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Thank you for your feedback!");
      setFormData({ rating: "5", comment: "" });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="page page-wrap" style={{ maxWidth: "600px" }}>
      <div className="page-hd">
        <div>
          <h1 className="sec-title">My Reviews</h1>
          <p className="sec-sub">Share your experience with AutoCare Hub.</p>
        </div>
      </div>

      <div className="card" style={{ padding: "32px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--dark)", marginBottom: "16px" }}>Leave a Review</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Overall Rating</label>
            <select className="select" value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})}>
              <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
              <option value="4">⭐⭐⭐⭐ - Good</option>
              <option value="3">⭐⭐⭐ - Average</option>
              <option value="2">⭐⭐ - Poor</option>
              <option value="1">⭐ - Terrible</option>
            </select>
          </div>
          <div className="form-group">
            <label className="label">Your Comments</label>
            <textarea className="textarea" required placeholder="How was your recent service?" value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})}></textarea>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}