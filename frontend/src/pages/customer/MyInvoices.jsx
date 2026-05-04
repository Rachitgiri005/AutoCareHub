import { useState } from "react";
import { Link } from "react-router-dom";

export default function MyInvoices() {
  // Mock data for presentation
  const [invoices] = useState([
    { _id: "INV-8821", date: "2026-04-15", amount: 129.99, status: "Paid", service: "Brake Pad Replacement" }
  ]);

  return (
    <div className="page page-wrap">
      <div className="page-hd">
        <div>
          <h1 className="sec-title">Billing & Invoices</h1>
          <p className="sec-sub">Review your service history and payments.</p>
        </div>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Date</th>
              <th>Service Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td style={{ fontWeight: "700" }}>{inv._id}</td>
                <td>{new Date(inv.date).toLocaleDateString()}</td>
                <td>{inv.service}</td>
                <td style={{ fontWeight: "600" }}>${inv.amount.toFixed(2)}</td>
                <td><span className={`badge badge-${inv.status.toLowerCase()}`}>{inv.status}</span></td>
                <td>
                  <button className="btn btn-ghost btn-sm">Download PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}