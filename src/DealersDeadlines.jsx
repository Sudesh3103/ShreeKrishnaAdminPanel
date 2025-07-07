import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

const ENTRIES_OPTIONS = [5, 10, 25, 50];

export default function DealersDeadlines() {
  const [deadlines, setDeadlines] = useState([
    {
      id: 1,
      dealer: "Dealer One",
      deadlineDate: "2024-07-15",
      task: "Submit quarterly sales report",
      status: "Pending",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    dealer: "",
    deadlineDate: "",
    task: "",
    status: "Pending",
  });
  const [editMode, setEditMode] = useState(false);
  const [editDeadlineId, setEditDeadlineId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Add Deadline
  const handleAddDeadline = () => {
    setDeadlines([...deadlines, { ...formData, id: Date.now() }]);
    setShowModal(false);
    setFormData({ dealer: "", deadlineDate: "", task: "", status: "Pending" });
  };

  // Edit Deadline
  const handleEditDeadline = (deadline) => {
    setEditMode(true);
    setEditDeadlineId(deadline.id);
    setFormData({ ...deadline });
    setShowModal(true);
  };

  // Update Deadline
  const handleUpdateDeadline = () => {
    setDeadlines((prev) =>
      prev.map((d) =>
        d.id === editDeadlineId
          ? { ...d, ...formData }
          : d
      )
    );
    setShowModal(false);
    setEditMode(false);
    setEditDeadlineId(null);
    setFormData({ dealer: "", deadlineDate: "", task: "", status: "Pending" });
  };

  // Delete Deadline
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this deadline?")) {
      setDeadlines(deadlines.filter((d) => d.id !== id));
    }
  };

  // Toggle Status
  const toggleStatus = (id) => {
    setDeadlines((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: d.status === "Completed" ? "Pending" : "Completed" } : d
      )
    );
  };

  // Sorting logic
  const sortedDeadlines = React.useMemo(() => {
    let sortable = [...deadlines];
    if (searchTerm) {
      sortable = sortable.filter((d) =>
        d.dealer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.task.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "dealer") {
          aValue = a.dealer.toLowerCase();
          bValue = b.dealer.toLowerCase();
        } else if (sortConfig.key === "srno") {
          aValue = a.id;
          bValue = b.id;
        } else if (sortConfig.key === "deadlineDate") {
          aValue = a.deadlineDate;
          bValue = b.deadlineDate;
        } else if (sortConfig.key === "task") {
          aValue = a.task.toLowerCase();
          bValue = b.task.toLowerCase();
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
  }, [deadlines, searchTerm, sortConfig]);

  // Pagination
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentDeadlines = sortedDeadlines.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedDeadlines.length / entriesPerPage);

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
          <h2 className="fw-bold mb-0">Dealers Deadlines</h2>
          <small className="text-muted">Manage dealer deadlines for the next 3 months</small>
        </div>
        <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => { setShowModal(true); setEditMode(false); setFormData({ dealer: "", deadlineDate: "", task: "", status: "Pending" }); }}>
          <Plus size={18} /> Add Deadline
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
              placeholder="Search deadlines..."
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("srno")}>Sr. No {renderSortIcon("srno")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("dealer")}>Dealer Name {renderSortIcon("dealer")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("deadlineDate")}>Deadline Date {renderSortIcon("deadlineDate")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("task")}>Task {renderSortIcon("task")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("status")}>Status {renderSortIcon("status")}</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentDeadlines.length > 0 ? (
                currentDeadlines.map((deadline, index) => (
                  <tr key={deadline.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td>{deadline.dealer}</td>
                    <td>{deadline.deadlineDate}</td>
                    <td>{deadline.task}</td>
                    <td>
                      <span
                        className={`badge rounded-pill text-white ${deadline.status === "Completed" ? "bg-success" : "bg-warning"}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleStatus(deadline.id)}
                      >
                        {deadline.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-info me-2 text-white" onClick={() => handleEditDeadline(deadline)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(deadline.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No deadlines found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-3">
          <small className="text-muted">
            Showing {sortedDeadlines.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, sortedDeadlines.length)} of {sortedDeadlines.length} entries
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
                <h5 className="modal-title">{editMode ? "Edit Deadline" : "Add Deadline"}</h5>
                <button className="btn-close" onClick={() => { setShowModal(false); setEditMode(false); setEditDeadlineId(null); }}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Dealer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.dealer}
                    onChange={(e) => setFormData({ ...formData, dealer: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Deadline Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.deadlineDate}
                    onChange={(e) => setFormData({ ...formData, deadlineDate: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Task/Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.task}
                    onChange={(e) => setFormData({ ...formData, task: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => { setShowModal(false); setEditMode(false); setEditDeadlineId(null); }}>
                  Cancel
                </button>
                {editMode ? (
                  <button className="btn btn-success" onClick={handleUpdateDeadline}>
                    Update
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={handleAddDeadline}>
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