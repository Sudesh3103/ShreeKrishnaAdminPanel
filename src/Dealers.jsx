import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Spinner } from "react-bootstrap";

const ENTRIES_OPTIONS = [5, 10, 25, 50];

export default function Dealers() {
  const [dealers, setDealers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    status: "active",
    businessAddress: "",
    state: "",
    zipCode: "",
    country: "",
    alternatePhone: "",
    businessRegistrationNumber: "",
    taxId: "",
    businessType: "",
    yearsInBusiness: "",
    paymentTerms: "",
    creditLimit: "",
    approvalStatus: "pending",
    notes: "",
    logoUrl: "",
    registrationDate: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [editDealerId, setEditDealerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [totalDealers, setTotalDealers] = useState(0);

  // Fetch dealers from backend
  const fetchDealers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expired. Please log in again.');
        setLoading(false);
        return;
      }
      const params = new URLSearchParams({
        page: currentPage,
        limit: entriesPerPage,
        search: searchTerm
      });
      const response = await fetch(`http://localhost:3000/api/dealers?${params.toString()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setDealers(result.data.dealers || []);
        setTotalDealers(result.data.pagination?.total || (result.data.dealers || []).length);
      } else {
        setError(result?.error?.message || "Failed to fetch dealers.");
      }
    } catch (err) {
      setError("Failed to fetch dealers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealers();
    // eslint-disable-next-line
  }, [currentPage, entriesPerPage, searchTerm]);

  // Add Dealer
  const handleAddDealer = async (e) => {
    e.preventDefault();
    setActionError("");
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setActionError('Session expired. Please log in again.');
        setActionLoading(false);
        return;
      }
      const response = await fetch("http://localhost:3000/api/dealers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setShowModal(false);
        setFormData({ businessName: "", contactPerson: "", email: "", phone: "", city: "", status: "active", businessAddress: "", state: "", zipCode: "", country: "", alternatePhone: "", businessRegistrationNumber: "", taxId: "", businessType: "", yearsInBusiness: "", paymentTerms: "", creditLimit: "", approvalStatus: "pending", notes: "", logoUrl: "", registrationDate: "" });
        fetchDealers();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to add dealer.");
      }
    } catch (err) {
      setActionError("Failed to add dealer.");
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Dealer
  const handleEditDealer = (dealer) => {
    setEditMode(true);
    setEditDealerId(dealer.id);
    setFormData({
      businessName: dealer.businessName || "",
      contactPerson: dealer.contactPerson || "",
      email: dealer.email || "",
      phone: dealer.phone || "",
      city: dealer.city || "",
      status: dealer.status || "active",
      businessAddress: dealer.businessAddress || "",
      state: dealer.state || "",
      zipCode: dealer.zipCode || "",
      country: dealer.country || "",
      alternatePhone: dealer.alternatePhone || "",
      businessRegistrationNumber: dealer.businessRegistrationNumber || "",
      taxId: dealer.taxId || "",
      businessType: dealer.businessType || "",
      yearsInBusiness: dealer.yearsInBusiness || "",
      paymentTerms: dealer.paymentTerms || "",
      creditLimit: dealer.creditLimit || "",
      approvalStatus: dealer.approvalStatus || "pending",
      notes: dealer.notes || "",
      logoUrl: dealer.logoUrl || "",
      registrationDate: dealer.registrationDate || ""
    });
    setShowModal(true);
    setActionError("");
  };

  // Update Dealer
  const handleUpdateDealer = async (e) => {
    e.preventDefault();
    setActionError("");
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setActionError('Session expired. Please log in again.');
        setActionLoading(false);
        return;
      }
      const response = await fetch(`http://localhost:3000/api/dealers/${editDealerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setShowModal(false);
        setEditMode(false);
        setEditDealerId(null);
        setFormData({ businessName: "", contactPerson: "", email: "", phone: "", city: "", status: "active", businessAddress: "", state: "", zipCode: "", country: "", alternatePhone: "", businessRegistrationNumber: "", taxId: "", businessType: "", yearsInBusiness: "", paymentTerms: "", creditLimit: "", approvalStatus: "pending", notes: "", logoUrl: "", registrationDate: "" });
        fetchDealers();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to update dealer.");
      }
    } catch (err) {
      setActionError("Failed to update dealer.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Dealer
  const handleDelete = async (id) => {
    setActionError("");
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setActionError('Session expired. Please log in again.');
        setActionLoading(false);
        return;
      }
      const response = await fetch(`http://localhost:3000/api/dealers/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchDealers();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to delete dealer.");
      }
    } catch (err) {
      setActionError("Failed to delete dealer.");
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Status
  const toggleStatus = (id) => {
    setDealers((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === "active" ? "inactive" : "active" } : d
      )
    );
  };

  // Sorting logic
  const sortedDealers = React.useMemo(() => {
    let sortable = [...dealers];
    if (searchTerm) {
      sortable = sortable.filter((d) =>
        d.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm) ||
        d.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "businessName") {
          aValue = a.businessName.toLowerCase();
          bValue = b.businessName.toLowerCase();
        } else if (sortConfig.key === "srno") {
          aValue = a.id;
          bValue = b.id;
        } else if (sortConfig.key === "email") {
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
        } else if (sortConfig.key === "phone") {
          aValue = a.phone;
          bValue = b.phone;
        } else if (sortConfig.key === "city") {
          aValue = a.city.toLowerCase();
          bValue = b.city.toLowerCase();
        } else if (sortConfig.key === "status") {
          aValue = a.status;
          bValue = b.status;
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [dealers, searchTerm, sortConfig]);

  // Pagination
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentDealers = sortedDealers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedDealers.length / entriesPerPage);

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
          <h2 className="fw-bold mb-0">Dealers</h2>
          <small className="text-muted">Manage dealers</small>
        </div>
        <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => { setShowModal(true); setEditMode(false); setFormData({ businessName: "", contactPerson: "", email: "", phone: "", city: "", status: "active", businessAddress: "", state: "", zipCode: "", country: "", alternatePhone: "", businessRegistrationNumber: "", taxId: "", businessType: "", yearsInBusiness: "", paymentTerms: "", creditLimit: "", approvalStatus: "pending", notes: "", logoUrl: "", registrationDate: "" }); }}>
          <Plus size={18} /> Add Dealer
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
              placeholder="Search dealers..."
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Sr. No</th>
                <th>Business Name</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Alternate Phone</th>
                <th>Business Address</th>
                <th>City</th>
                <th>State</th>
                <th>Zip Code</th>
                <th>Country</th>
                <th>Business Reg. No.</th>
                <th>Tax ID</th>
                <th>Business Type</th>
                <th>Years in Business</th>
                <th>Payment Terms</th>
                <th>Credit Limit</th>
                <th>Approval Status</th>
                <th>Notes</th>
                <th>Status</th>
                <th>Logo</th>
                <th>Registration Date</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={25} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
              ) : currentDealers.length === 0 ? (
                <tr>
                  <td colSpan="25" className="text-center text-muted">No dealers found</td>
                </tr>
              ) : (
                currentDealers.map((dealer, index) => (
                  <tr key={dealer.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{dealer.businessName}</td>
                    <td>{dealer.contactPerson}</td>
                    <td>{dealer.email}</td>
                    <td>{dealer.phone}</td>
                    <td>{dealer.alternatePhone}</td>
                    <td>{dealer.businessAddress}</td>
                    <td>{dealer.city}</td>
                    <td>{dealer.state}</td>
                    <td>{dealer.zipCode}</td>
                    <td>{dealer.country}</td>
                    <td>{dealer.businessRegistrationNumber}</td>
                    <td>{dealer.taxId}</td>
                    <td>{dealer.businessType}</td>
                    <td>{dealer.yearsInBusiness}</td>
                    <td>{dealer.paymentTerms}</td>
                    <td>{dealer.creditLimit}</td>
                    <td>{dealer.approvalStatus}</td>
                    <td>{dealer.notes}</td>
                    <td><span className={`badge rounded-pill text-white ${dealer.status === "active" ? "bg-success" : "bg-danger"}`}>{dealer.status}</span></td>
                    <td>{dealer.logoUrl ? <img src={dealer.logoUrl} alt="Logo" width={32} height={32} /> : "-"}</td>
                    <td>{dealer.registrationDate}</td>
                    <td>{dealer.createdAt}</td>
                    <td>{dealer.updatedAt}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEditDealer(dealer)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dealer.id)} disabled={actionLoading}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Showing {sortedDealers.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, sortedDealers.length)} of {sortedDealers.length} entries
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editMode ? "Edit Dealer" : "Add Dealer"}</h5>
                <button className="btn-close" onClick={() => { setShowModal(false); setEditMode(false); setEditDealerId(null); }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Dealer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Business Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.businessAddress}
                    onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Alternate Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.alternatePhone || ""}
                    onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Business Registration Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.businessRegistrationNumber || ""}
                    onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tax ID</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.taxId || ""}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Business Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.businessType || ""}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Years in Business</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.yearsInBusiness || ""}
                    onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment Terms</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.paymentTerms || ""}
                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Credit Limit</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.creditLimit || ""}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Approval Status</label>
                  <select
                    className="form-select"
                    value={formData.approvalStatus || "pending"}
                    onChange={(e) => setFormData({ ...formData, approvalStatus: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Logo URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.logoUrl || ""}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Registration Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.registrationDate || ""}
                    onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setShowModal(false); setEditMode(false); setEditDealerId(null); }}>
                  Cancel
                </button>
                {editMode ? (
                  <button className="btn btn-success" onClick={handleUpdateDealer}>
                    Update
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={handleAddDealer}>
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}