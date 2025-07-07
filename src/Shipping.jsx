import React, { useState } from "react";

function Shipping() {
  // Mock order data
  const orders = {
    "001698653lp": {
      shippedVia: "UPS Ground",
      status: "Checking Quality",
      expectedDate: "SEP 09, 2017",
      currentStep: 2,
    },
    "123456": {
      shippedVia: "FedEx",
      status: "On the way",
      expectedDate: "JUN 10, 2024",
      currentStep: 3,
    },
    "654321": {
      shippedVia: "DHL",
      status: "Delivered",
      expectedDate: "JUN 08, 2024",
      currentStep: 4,
    },
    "789012": {
      shippedVia: "BlueDart",
      status: "Processing",
      expectedDate: "JUN 12, 2024",
      currentStep: 1,
    },
  };

  const steps = [
    {
      label: "Confirmed Order",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="none"/><g stroke="#fff" strokeWidth="2"><rect x="8" y="12" width="16" height="10" rx="2"/><path d="M12 12V10a4 4 0 0 1 8 0v2"/></g></svg>
      ),
    },
    {
      label: "Processing Order",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="none"/><g stroke="#fff" strokeWidth="2"><circle cx="16" cy="16" r="6"/><path d="M16 10v2M16 20v2M10 16h2M20 16h2"/></g></svg>
      ),
    },
    {
      label: "Quality Check",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="none"/><g stroke="#fff" strokeWidth="2"><circle cx="16" cy="14" r="4"/><path d="M16 18v4"/><circle cx="16" cy="24" r="1"/></g></svg>
      ),
    },
    {
      label: "Product Dispatched",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="none"/><g stroke="#1976d2" strokeWidth="2"><rect x="10" y="14" width="12" height="6" rx="2"/><circle cx="12" cy="22" r="2"/><circle cx="20" cy="22" r="2"/><path d="M22 14v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></g></svg>
      ),
    },
    {
      label: "Product Delivered",
      icon: (
        <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="none"/><g stroke="#1976d2" strokeWidth="2"><path d="M10 18v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><path d="M12 18v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2"/><path d="M16 22v2"/></g></svg>
      ),
    },
  ];

  const [input, setInput] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [notify, setNotify] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    if (!input) {
      setError("Please enter a tracking/order number.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }
      const response = await fetch(`http://localhost:3000/api/orders?trackingNumber=${encodeURIComponent(input)}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success && result.data.orders && result.data.orders.length > 0) {
        setOrder({ ...result.data.orders[0], trackingNumber: input });
        setError("");
      } else {
        setOrder(null);
        setError("Order not found. Please check the number and try again.");
      }
    } catch (err) {
      setOrder(null);
      setError("Failed to fetch order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="track-container">
      <form className="track-form" onSubmit={handleTrack}>
        <input
          className="track-input"
          type="text"
          placeholder="Enter Tracking/Order Number"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="track-btn" type="submit">Track</button>
      </form>
      {loading && <div className="track-error">Loading...</div>}
      {error && <div className="track-error">{error}</div>}
      {order && (
        <>
          <div className="track-header mt-3">
            <span>TRACKING ORDER NO - <b>{order.trackingNumber}</b></span>
          </div>
          <div className="track-info-row">
            <div>Shipped Via: <b>{order.shippedVia}</b></div>
            <div>Status: <b>{order.status}</b></div>
            <div>Expected Date: <b>{order.expectedDate}</b></div>
          </div>
          <div className="track-stepper">
            {steps.map((step, idx) => (
              <div key={step.label} className={`stepper-step${idx <= order.currentStep ? " active" : ""}`}> 
                <div className="stepper-icon">{step.icon}</div>
                <div className="stepper-label">{step.label}</div>
                {idx < steps.length - 1 && <div className="stepper-line" />}
              </div>
            ))}
          </div>
          <div className="track-actions">
            <label className="notify-label">
              <input type="checkbox" checked={notify} onChange={() => setNotify(!notify)} />
              Notify me when order is delivered
            </label>
            <button className="order-details-btn">View Order Details</button>
          </div>
        </>
      )}
      <style>{`
        .track-container {
          max-width: 900px;
          margin: 32px auto;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 4px 24px rgba(25, 118, 210, 0.10);
          overflow: hidden;
          padding-bottom: 24px;
          font-family: 'Segoe UI', 'Arial', sans-serif;
        }
        .track-form {
          display: flex;
          gap: 10px;
          padding: 24px 36px 0 36px;
        }
        .track-input {
          flex: 1;
          padding: 12px 16px;
          border: 1.5px solid #bdbdbd;
          border-radius: 8px;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .track-input:focus {
          border: 1.5px solid #1976d2;
        }
        .track-btn {
          padding: 12px 22px;
          background: #1976d2;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .track-btn:hover {
          background: #125ea2;
        }
        .track-error {
          color: #d32f2f;
          margin: 12px 36px 0 36px;
          text-align: left;
        }
        .track-header {
          background: #1976d2;
          color: #fff;
          font-size: 1.3rem;
          padding: 28px 36px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .track-info-row {
          display: flex;
          justify-content: space-between;
          background: #f7f7f7;
          padding: 20px 36px;
          font-size: 1.1rem;
          color: #222;
        }
        .track-stepper {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 44px 36px 24px 36px;
          position: relative;
        }
        .stepper-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          flex: 1;
          min-width: 80px;
        }
        .stepper-icon {
          width: 60px;
          height: 60px;
          background: #e3f2fd;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          border: 3px solid #e3f2fd;
          transition: background 0.3s, border 0.3s;
        }
        .stepper-step.active .stepper-icon {
          background: #03a9f4;
          border: 3px solid #03a9f4;
        }
        .stepper-label {
          font-size: 1.05rem;
          color: #555;
          margin-bottom: 0;
          text-align: center;
          margin-top: 2px;
        }
        .stepper-step.active .stepper-label {
          color: #1976d2;
          font-weight: 600;
        }
        .stepper-line {
          position: absolute;
          top: 30px;
          left: 100%;
          width: calc(100% - 60px);
          height: 5px;
          background: #e3f2fd;
          z-index: 0;
        }
        .stepper-step.active .stepper-line {
          background: #03a9f4;
        }
        .track-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 36px 0 36px;
        }
        .notify-label {
          font-size: 1.1rem;
          color: #222;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .order-details-btn {
          background: #fff;
          color: #1976d2;
          border: 2px solid #1976d2;
          border-radius: 7px;
          padding: 10px 28px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .order-details-btn:hover {
          background: #1976d2;
          color: #fff;
        }
        @media (max-width: 900px) {
          .track-container {
            max-width: 99vw;
          }
          .track-header, .track-info-row, .track-stepper, .track-actions, .track-form {
            padding-left: 10px;
            padding-right: 10px;
          }
        }
        @media (max-width: 600px) {
          .track-info-row {
            flex-direction: column;
            gap: 8px;
            font-size: 1rem;
          }
          .track-stepper {
            flex-direction: column;
            align-items: stretch;
            padding: 18px 4px 10px 4px;
          }
          .stepper-step {
            flex-direction: row;
            align-items: center;
            margin-bottom: 22px;
          }
          .stepper-icon {
            margin-bottom: 0;
            margin-right: 12px;
          }
          .stepper-label {
            margin-top: 0;
            text-align: left;
          }
          .stepper-line {
            display: none;
          }
          .track-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
            padding-left: 4px;
            padding-right: 4px;
          }
        }
      `}</style>
    </div>
  );
}

export default Shipping;