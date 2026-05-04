import { useState } from "react";

export default function AdminInvoices() {
  const [invoices] = useState([
    { _id: "INV-8821", customer: "John Doe", amount: 129.99, date: "2026-05-02", status: "Paid" },
    { _id: "INV-8822", customer: "Jane Smith", amount: 45.00, date: "2026-05-03", status: "Unpaid" }
  ]);

  return (
    <div className="page page-wrap">
      <div className="page-hd">
        <div>
          <h1 className="sec-title">Financial Records</h1>
          <p className="sec-sub">Track all system invoices and payments.</p>
        </div>
        <button className="btn btn-primary">Generate Report</button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Date Issued</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv._id}>
                <td style={{ fontWeight: "700" }}>{inv._id}</td>
                <td>{inv.customer}</td>
                <td style={{ fontWeight: "600" }}>${inv.amount.toFixed(2)}</td>
                <td>{new Date(inv.date).toLocaleDateString()}</td>
                <td><span className={`badge badge-${inv.status.toLowerCase()}`}>{inv.status}</span></td>
                <td><button className="btn btn-outline btn-sm">Send Reminder</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}