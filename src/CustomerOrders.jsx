import React, { useState, useEffect } from 'react';
import { Trash2, Eye } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Alert } from 'react-bootstrap';

const ENTRIES_OPTIONS = [5, 10, 25, 50];

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalOrders, setTotalOrders] = useState(0);
  const [actionError, setActionError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: entriesPerPage,
        search: searchTerm
      });
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }
      const response = await fetch(`http://localhost:3000/api/orders?${params.toString()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setOrders(result.data.orders || []);
        setTotalOrders(result.data.pagination?.total || (result.data.orders || []).length);
      } else {
        setError(result?.error?.message || 'Failed to fetch orders.');
      }
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [currentPage, entriesPerPage, searchTerm]);

  // Sorting logic (client-side for now)
  const sortedOrders = React.useMemo(() => {
    let sortable = [...orders];
    if (searchTerm) {
      sortable = sortable.filter(order =>
        (order.orderNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.paymentMethod || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.paymentStatus || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.trackingNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aValue = a[sortConfig.key], bValue = b[sortConfig.key];
        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [orders, searchTerm, sortConfig]);

  const totalPages = Math.ceil(totalOrders / entriesPerPage);
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirst, indexOfLast);

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <span style={{ marginLeft: 4, color: '#bbb' }}>▲▼</span>;
    return sortConfig.direction === 'asc' ? (
      <span style={{ marginLeft: 4, color: '#007bff' }}>▲</span>
    ) : (
      <span style={{ marginLeft: 4, color: '#007bff' }}>▼</span>
    );
  };

  const handleEntriesChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Delete Order (if backend allows)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    setActionError('');
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setActionError('Session expired. Please log in again.');
        setActionLoading(false);
        return;
      }
      const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchOrders();
      } else {
        setActionError(result?.error?.message || result?.message || 'Failed to delete order.');
      }
    } catch (err) {
      setActionError('Failed to delete order.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold">Orders</h3>
          <p className="text-muted">Order List</p>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">
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
            className="form-control form-control-sm w-100"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search orders..."
          />
        </div>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {actionError && <Alert variant="danger">{actionError}</Alert>}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>Sr. No {renderSortIcon('id')}</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('orderNumber')}>Order Number {renderSortIcon('orderNumber')}</th>
              <th>User ID</th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>Status {renderSortIcon('status')}</th>
              <th>Total Amount</th>
              <th>Shipping Address</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Tracking Number</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
            ) : currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <tr key={order.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{order.orderNumber}</td>
                  <td>{order.userId}</td>
                  <td>{order.status}</td>
                  <td>{order.totalAmount}</td>
                  <td>{order.shippingAddress ? (typeof order.shippingAddress === 'object' ? JSON.stringify(order.shippingAddress) : order.shippingAddress) : '-'}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.trackingNumber || '-'}</td>
                  <td>{order.notes ? (order.notes.length > 20 ? order.notes.slice(0, 20) + '...' : order.notes) : '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-info me-1" onClick={() => alert('Order details view not implemented in this demo.') }>
                      <Eye size={16} />
                    </button>
                    <button className="btn btn-sm btn-danger mt-1" onClick={() => handleDelete(order.id)} disabled={actionLoading}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="text-center text-muted">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
        <small className="text-muted">
          Showing {sortedOrders.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, sortedOrders.length)} of {totalOrders} entries
        </small>
        <div className="btn-group">
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`btn btn-sm ${currentPage === i + 1 ? "btn-warning text-white" : "btn-outline-secondary"}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
}
