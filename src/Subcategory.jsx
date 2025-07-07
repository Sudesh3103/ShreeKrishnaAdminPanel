import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Modal, Button } from "react-bootstrap";

const ENTRIES_OPTIONS = [5, 10, 25, 50];
const MOCK_PARENT_CATEGORIES = ["Electronics", "Furniture", "Clothing", "Books"];
const INITIAL_SUBCATEGORIES = [
  { id: 1, name: "Mobile Phones", parent: "Electronics" },
  { id: 2, name: "Laptops", parent: "Electronics" },
  { id: 3, name: "Sofas", parent: "Furniture" },
];

export default function Subcategory() {
  const [subcategories, setSubcategories] = useState(INITIAL_SUBCATEGORIES);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", parent: MOCK_PARENT_CATEGORIES[0] });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // Add Subcategory
  const handleAdd = () => {
    setSubcategories([...subcategories, { ...formData, id: Date.now() }]);
    setShowModal(false);
    setFormData({ name: "", parent: MOCK_PARENT_CATEGORIES[0] });
  };

  // Edit Subcategory
  const handleEdit = (subcat) => {
    setEditMode(true);
    setEditId(subcat.id);
    setFormData({ name: subcat.name, parent: subcat.parent });
    setShowModal(true);
  };

  // Update Subcategory
  const handleUpdate = () => {
    setSubcategories((prev) =>
      prev.map((s) =>
        s.id === editId ? { ...s, name: formData.name, parent: formData.parent } : s
      )
    );
    setShowModal(false);
    setEditMode(false);
    setEditId(null);
    setFormData({ name: "", parent: MOCK_PARENT_CATEGORIES[0] });
  };

  // Delete Subcategory
  const handleDelete = (id) => {
    setSubcategories(subcategories.filter((s) => s.id !== id));
  };

  // Sorting logic
  const sortedSubcategories = React.useMemo(() => {
    let sortable = [...subcategories];
    if (searchTerm) {
      sortable = sortable.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.parent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "name") {
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
        } else if (sortConfig.key === "parent") {
          aValue = a.parent.toLowerCase();
          bValue = b.parent.toLowerCase();
        } else if (sortConfig.key === "srno") {
          aValue = a.id;
          bValue = b.id;
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [subcategories, searchTerm, sortConfig]);

  // Pagination
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentSubcategories = sortedSubcategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedSubcategories.length / entriesPerPage);

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
    <div className="container py-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Subcategory</h1>
          <p className="text-muted mb-0">Subcategory</p>
        </div>
        <button className="btn btn-warning d-flex align-items-center gap-2" onClick={() => { setShowModal(true); setEditMode(false); setFormData({ name: "", parent: MOCK_PARENT_CATEGORIES[0] }); }}>
          <Plus size={18} />
          Add Subcategory
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 shadow-sm rounded mb-4">
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
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search subcategories..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("srno")}>Sr. No {renderSortIcon("srno")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>Subcategory Name {renderSortIcon("name")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("parent")}>Parent Category {renderSortIcon("parent")}</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentSubcategories.length > 0 ? (
                currentSubcategories.map((subcat, index) => (
                  <tr key={subcat.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td className="fw-medium">{subcat.name}</td>
                    <td>{subcat.parent}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(subcat)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-sm btn-warning" onClick={() => handleDelete(subcat.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No subcategories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-end align-items-center mt-3 gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-sm btn-outline-primary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditMode(false); setEditId(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Subcategory" : "Add Subcategory"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={e => {
              e.preventDefault();
              editMode ? handleUpdate() : handleAdd();
            }}
          >
            <div className="mb-3">
              <label className="form-label">Subcategory Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Parent Category</label>
              <select
                className="form-select"
                value={formData.parent}
                onChange={e => setFormData({ ...formData, parent: e.target.value })}
                required
              >
                {MOCK_PARENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)} type="button">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editMode ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
} 