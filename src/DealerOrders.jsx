import React, { useState } from "react";
import { Edit, Trash2 } from "lucide-react";

const ENTRIES_OPTIONS = [5, 10, 25, 50];

export default function DealerOrders() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderId: "ORD1001",
      dealerName: "Dealer One",
      email: "dealer1@example.com",
      phone: "9876543210",
      address: "123 Main St, Mumbai",
      paymentMethod: "Credit Card",
      totalAmount: 2500,
      paymentStatus: "Paid",
      orderStatus: "Pending",
      orderDate: "2024-07-01",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Export Orders as CSV
  const handleExport = () => {
    const headers = [
      "Sr. No",
      "Order ID",
      "Dealer Name",
      "Email",
      "Phone",
      "Address",
      "Payment Method",
      "Total Amount",
      "Payment Status",
      "Order Status",
      "Order Date"
    ];
    const rows = sortedOrders.map((order, idx) => [
      idx + 1,
      order.orderId,
      order.dealerName,
      order.email,
      order.phone,
      order.address,
      order.paymentMethod,
      order.totalAmount,
      order.paymentStatus,
      order.orderStatus,
      order.orderDate
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "dealer_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sorting logic
  const sortedOrders = React.useMemo(() => {
    let sortable = [...orders];
    if (searchTerm) {
      sortable = sortable.filter((o) =>
        o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.phone.includes(searchTerm) ||
        o.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.orderStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.orderDate.includes(searchTerm)
      );
    }
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "orderId") {
          aValue = a.orderId.toLowerCase();
          bValue = b.orderId.toLowerCase();
        } else if (sortConfig.key === "srno") {
          aValue = a.id;
          bValue = b.id;
        } else if (sortConfig.key === "dealerName") {
          aValue = a.dealerName.toLowerCase();
          bValue = b.dealerName.toLowerCase();
        } else if (sortConfig.key === "email") {
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
        } else if (sortConfig.key === "phone") {
          aValue = a.phone;
          bValue = b.phone;
        } else if (sortConfig.key === "address") {
          aValue = a.address.toLowerCase();
          bValue = b.address.toLowerCase();
        } else if (sortConfig.key === "paymentMethod") {
          aValue = a.paymentMethod.toLowerCase();
          bValue = b.paymentMethod.toLowerCase();
        } else if (sortConfig.key === "totalAmount") {
          aValue = parseFloat(a.totalAmount) || 0;
          bValue = parseFloat(b.totalAmount) || 0;
        } else if (sortConfig.key === "paymentStatus") {
          aValue = a.paymentStatus;
          bValue = b.paymentStatus;
        } else if (sortConfig.key === "orderStatus") {
          aValue = a.orderStatus;
          bValue = b.orderStatus;
        } else if (sortConfig.key === "orderDate") {
          aValue = a.orderDate;
          bValue = b.orderDate;
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [orders, searchTerm, sortConfig]);

  // Pagination
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedOrders.length / entriesPerPage);

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Sort icon
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <span style={{ marginLeft: 4, color: '#bbb' }}>▲▼</span>;
    return sortConfig.direction === "asc" ? (
      <span style={{ marginLeft: 4, color: '#007bff' }}>▲</span>
    ) : (
      <span style={{ marginLeft: 4, color: '#007bff' }}>▼</span>
    );
  };

  // Handle entries per page change
  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0">Dealer Orders</h2>
          <small className="text-muted">Manage dealer orders</small>
        </div>
        <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleExport}>
          Export Orders
        </button>
      </div>

      <div className="card p-3">
        <div className="d-flex justify-content-between mb-3 flex-wrap">
          <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
            <span>Show</span>
            <select
              className="form-select form-select-sm w-auto"
              value={entriesPerPage}
              onChange={handleEntriesChange}
              style={{ width: 80 }}
            >
              {ENTRIES_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <span>entries</span>
          </div>
          <div style={{ maxWidth: 250 }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control form-control-sm w-100"
              placeholder="Search orders..."
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("srno")}>Sr. No {renderSortIcon("srno")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("orderId")}>Order ID {renderSortIcon("orderId")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("dealerName")}>Dealer Name {renderSortIcon("dealerName")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("email")}>Email {renderSortIcon("email")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("phone")}>Phone {renderSortIcon("phone")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("address")}>Address {renderSortIcon("address")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("paymentMethod")}>Payment Method {renderSortIcon("paymentMethod")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("totalAmount")}>Total Amount {renderSortIcon("totalAmount")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("paymentStatus")}>Payment Status {renderSortIcon("paymentStatus")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("orderStatus")}>Order Status {renderSortIcon("orderStatus")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("orderDate")}>Order Date {renderSortIcon("orderDate")}</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <tr key={order.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{order.orderId}</td>
                    <td>{order.dealerName}</td>
                    <td>{order.email}</td>
                    <td>{order.phone}</td>
                    <td>{order.address}</td>
                    <td>{order.paymentMethod}</td>
                    <td>₹{parseFloat(order.totalAmount || 0).toFixed(2)}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{order.orderStatus}</td>
                    <td>{order.orderDate}</td>
                    <td>
                      <button className="btn btn-sm btn-info me-2 text-white" onClick={() => alert('Edit functionality not implemented in this demo.') }>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(order.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center text-muted">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Showing {sortedOrders.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, sortedOrders.length)} of {sortedOrders.length} entries
          </small>
          <div>
            <button
              className="btn btn-sm btn-outline-secondary me-1"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`btn btn-sm me-1 ${currentPage === i + 1 ? "btn-success" : "btn-outline-secondary"}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}