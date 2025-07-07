import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

const ENTRIES_OPTIONS = [5, 10, 25, 50];

export default function DealerOffers() {
  const [offers, setOffers] = useState([
    {
      id: 1,
      name: "Bulk Purchase Offer",
      price: 999,
      dealers: "Dealer A, Dealer B",
      expiryDate: "2024-12-31",
      status: "Active",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    dealers: "",
    expiryDate: "",
    status: "Inactive",
  });
  const [editMode, setEditMode] = useState(false);
  const [editOfferId, setEditOfferId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Add Offer
  const handleAddOffer = () => {
    setOffers([...offers, { ...formData, id: Date.now() }]);
    setShowModal(false);
    setFormData({ name: "", price: "", dealers: "", expiryDate: "", status: "Inactive" });
  };

  // Edit Offer
  const handleEditOffer = (offer) => {
    setEditMode(true);
    setEditOfferId(offer.id);
    setFormData({ ...offer });
    setShowModal(true);
  };

  // Update Offer
  const handleUpdateOffer = () => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === editOfferId
          ? { ...o, ...formData }
          : o
      )
    );
    setShowModal(false);
    setEditMode(false);
    setEditOfferId(null);
    setFormData({ name: "", price: "", dealers: "", expiryDate: "", status: "Inactive" });
  };

  // Delete Offer
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this dealer offer?")) {
      setOffers(offers.filter((o) => o.id !== id));
    }
  };

  // Toggle Status
  const toggleStatus = (id) => {
    setOffers((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: o.status === "Active" ? "Inactive" : "Active" } : o
      )
    );
  };

  // Sorting logic
  const sortedOffers = React.useMemo(() => {
    let sortable = [...offers];
    if (searchTerm) {
      sortable = sortable.filter((o) =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "name") {
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
        } else if (sortConfig.key === "srno") {
          aValue = a.id;
          bValue = b.id;
        } else if (sortConfig.key === "price") {
          aValue = parseFloat(a.price) || 0;
          bValue = parseFloat(b.price) || 0;
        } else if (sortConfig.key === "status") {
          aValue = a.status;
          bValue = b.status;
        } else if (sortConfig.key === "expiryDate") {
          aValue = a.expiryDate;
          bValue = b.expiryDate;
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [offers, searchTerm, sortConfig]);

  // Pagination
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentOffers = sortedOffers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedOffers.length / entriesPerPage);

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
          <h2 className="fw-bold mb-0">Dealer Offers</h2>
          <small className="text-muted">Manage dealer offers</small>
        </div>
        <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => { setShowModal(true); setEditMode(false); setFormData({ name: "", price: "", dealers: "", expiryDate: "", status: "Inactive" }); }}>
          <Plus size={18} /> Add Offer
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
              placeholder="Search offers..."
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("srno")}>Sr. No {renderSortIcon("srno")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>Offer Name {renderSortIcon("name")}</th>
                <th>Eligible Dealers</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("price")}>Price (₹) {renderSortIcon("price")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("expiryDate")}>Expiry Date {renderSortIcon("expiryDate")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>Status {renderSortIcon("status")}</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentOffers.length > 0 ? (
                currentOffers.map((offer, index) => (
                  <tr key={offer.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{offer.name}</td>
                    <td>{offer.dealers}</td>
                    <td>₹{parseFloat(offer.price || 0).toFixed(2)}</td>
                    <td>{offer.expiryDate}</td>
                    <td>
                      <span
                        className={`badge rounded-pill text-white ${offer.status === "Active" ? "bg-success" : "bg-danger"}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleStatus(offer.id)}
                      >
                        {offer.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-info me-2 text-white" onClick={() => handleEditOffer(offer)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(offer.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No dealer offers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Showing {sortedOffers.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, sortedOffers.length)} of {sortedOffers.length} entries
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
                <h5 className="modal-title">{editMode ? "Edit Offer" : "Add Offer"}</h5>
                <button className="btn-close" onClick={() => { setShowModal(false); setEditMode(false); setEditOfferId(null); }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Offer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Eligible Dealers (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.dealers}
                    onChange={(e) => setFormData({ ...formData, dealers: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setShowModal(false); setEditMode(false); setEditOfferId(null); }}>
                  Cancel
                </button>
                {editMode ? (
                  <button className="btn btn-success" onClick={handleUpdateOffer}>
                    Update
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={handleAddOffer}>
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