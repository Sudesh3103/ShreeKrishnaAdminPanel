import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";

const ENTRIES_OPTIONS = [5, 10, 25, 50];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", slug: "", parentId: "", image: "" });
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [totalCategories, setTotalCategories] = useState(0);
  const [parentOptions, setParentOptions] = useState([]);

  // Fetch categories from backend
  const fetchCategories = async () => {
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
      const response = await fetch(`http://localhost:3000/api/categories?${params.toString()}`);
      const result = await response.json();
      if (result.success) {
        // Only show active categories
        const activeCategories = (result.data.categories || []).filter(c => c.isActive !== false);
        setCategories(activeCategories);
        setTotalCategories(activeCategories.length);
        // For parent options (main categories only)
        setParentOptions(activeCategories.filter(c => !c.parentId));
      } else {
        setError(result?.error?.message || "Failed to fetch categories.");
      }
    } catch (err) {
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, [currentPage, entriesPerPage, searchTerm]);

  // Sorting logic (client-side for now)
  const sortedCategories = React.useMemo(() => {
    let sortable = [...categories];
    if (searchTerm) {
      sortable = sortable.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.slug || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aValue = a[sortConfig.key], bValue = b[sortConfig.key];
        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [categories, searchTerm, sortConfig]);

  // Pagination
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentCategories = sortedCategories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedCategories.length / entriesPerPage);

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

  // Add Category
  const handleAddCategory = async (e) => {
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
      const response = await fetch("http://localhost:3000/api/categories", {
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
        setFormData({ name: "", description: "", slug: "", parentId: "", image: "" });
        fetchCategories();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to add category.");
      }
    } catch (err) {
      setActionError("Failed to add category.");
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Category
  const handleEditCategory = (cat) => {
    setEditMode(true);
    setEditCategoryId(cat.id);
    setFormData({
      name: cat.name,
      description: cat.description || "",
      slug: cat.slug || "",
      parentId: cat.parentId || "",
      image: cat.image || ""
    });
    setShowModal(true);
    setActionError("");
  };

  // Update Category
  const handleUpdateCategory = async (e) => {
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
      const response = await fetch(`http://localhost:3000/api/categories/${editCategoryId}`, {
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
        setEditCategoryId(null);
        setFormData({ name: "", description: "", slug: "", parentId: "", image: "" });
        fetchCategories();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to update category.");
      }
    } catch (err) {
      setActionError("Failed to update category.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Category
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
      const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchCategories();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to delete category.");
      }
    } catch (err) {
      setActionError("Failed to delete category.");
    } finally {
      setActionLoading(false);
    }
  };

  // Get parent name by id
  const getParentName = (parentId) => {
    const parent = parentOptions.find((p) => p.id === parentId);
    return parent ? parent.name : "-";
  };

  return (
    <div className="container py-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Category</h1>
          <p className="text-muted mb-0">Category</p>
        </div>
        <button className="btn btn-warning d-flex align-items-center gap-2" onClick={() => { setShowModal(true); setEditMode(false); setFormData({ name: "", description: "", slug: "", parentId: "", image: "" }); setActionError(""); }}>
          <Plus size={18} />
          Add Category
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
              placeholder="Search categories..."
            />
          </div>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("id")}>Sr. No {renderSortIcon("id")}</th>
                <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>Name {renderSortIcon("name")}</th>
                <th>Description</th>
                <th>Slug</th>
                <th>Parent</th>
                <th>Image</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
              ) : currentCategories.length > 0 ? (
                currentCategories.map((category, index) => (
                  <tr key={category.id}>
                    <td>{indexOfFirst + index + 1}</td>
                    <td className="fw-medium">{category.name}</td>
                    <td>{category.description || "-"}</td>
                    <td>{category.slug}</td>
                    <td>{getParentName(category.parentId)}</td>
                    <td>{category.image ? <img src={category.image} alt={category.name} className="rounded" width={48} height={48} /> : "No image"}</td>
                    <td>{category.isActive ? "Active" : "Inactive"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEditCategory(category)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-sm btn-warning" onClick={() => handleDelete(category.id)} disabled={actionLoading}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center text-muted">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
          <small className="text-muted">
            Showing {sortedCategories.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, sortedCategories.length)} of {sortedCategories.length} entries
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditMode(false); setEditCategoryId(null); setFormData({ name: "", description: "", slug: "", parentId: "", image: "" }); setActionError(""); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Category" : "Add Category"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={editMode ? handleUpdateCategory : handleAddCategory}>
          <Modal.Body>
            {actionError && <Alert variant="danger">{actionError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="Enter slug"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Parent Category</Form.Label>
              <Form.Select
                value={formData.parentId || ""}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? Number(e.target.value) : "" })}
              >
                <option value="">None</option>
                {parentOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="Enter image URL"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditMode(false); setEditCategoryId(null); setFormData({ name: "", description: "", slug: "", parentId: "", image: "" }); setActionError(""); }}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={actionLoading}>
              {actionLoading ? <Spinner animation="border" size="sm" /> : (editMode ? "Update" : "Save")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}