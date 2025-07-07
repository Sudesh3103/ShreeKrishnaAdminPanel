import React, { useState, useEffect } from "react";
import { Table, Button, Form, InputGroup, Pagination, Modal, Spinner, Alert } from "react-bootstrap";

const ENTRIES_OPTIONS = [5, 10, 25, 50];

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [brandsPerPage, setBrandsPerPage] = useState(5);
  const [totalBrands, setTotalBrands] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editBrandId, setEditBrandId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteBrandId, setDeleteBrandId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  // Fetch brands from backend API with pagination and search
  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: brandsPerPage,
        search: searchTerm
      });
      const response = await fetch(`http://localhost:3000/api/brands?${params.toString()}`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      const result = await response.json();
      // Only show active brands for this page
      const activeBrands = (result?.data?.brands || []).filter(b => b.status === 'active');
      setBrands(activeBrands);
      // Use backend's pagination total for correct total pages
      setTotalBrands(result?.data?.pagination?.total || activeBrands.length);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      setBrands([]);
      setTotalBrands(0);
    }
  };

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line
  }, [currentPage, brandsPerPage, searchTerm]);

  // Sorting logic (client-side for now)
  const sortedBrands = React.useMemo(() => {
    let sortable = [...brands];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "name") {
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
        } else if (sortConfig.key === "id") {
          aValue = a.id;
          bValue = b.id;
        }
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [brands, sortConfig]);

  const totalPages = Math.ceil(totalBrands / brandsPerPage);

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
    setBrandsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Add Brand logic
  const handleAddBrand = async (e) => {
    e.preventDefault();
    setAddError("");
    if (!newBrandName.trim()) {
      setAddError("Brand name is required.");
      return;
    }
    setAdding(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAddError('Session expired. Please log in again.');
        setAdding(false);
        return;
      }
      const response = await fetch("http://localhost:3000/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newBrandName.trim() })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setShowModal(false);
        setNewBrandName("");
        fetchBrands();
      } else {
        setAddError(result?.error?.message || result?.message || "Failed to add brand.");
      }
    } catch (error) {
      setAddError("Failed to add brand.");
    } finally {
      setAdding(false);
    }
  };

  // Edit Brand logic
  const openEditModal = (brand) => {
    setEditMode(true);
    setEditBrandId(brand.id);
    setNewBrandName(brand.name);
    setEditError("");
    setShowModal(true);
  };

  const handleEditBrand = async (e) => {
    e.preventDefault();
    setEditError("");
    if (!newBrandName.trim()) {
      setEditError("Brand name is required.");
      return;
    }
    setAdding(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setEditError('Session expired. Please log in again.');
        setAdding(false);
        return;
      }
      const response = await fetch(`http://localhost:3000/api/brands/${editBrandId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: newBrandName.trim() })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setShowModal(false);
        setNewBrandName("");
        setEditBrandId(null);
        setEditMode(false);
        fetchBrands();
      } else {
        setEditError(result?.error?.message || result?.message || "Failed to update brand.");
      }
    } catch (error) {
      setEditError("Failed to update brand.");
    } finally {
      setAdding(false);
    }
  };

  // Delete Brand logic
  const openDeleteModal = (brandId) => {
    setDeleteBrandId(brandId);
    setShowDeleteModal(true);
  };

  const handleDeleteBrand = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setDeleteLoading(false);
        setShowDeleteModal(false);
        setDeleteError('Session expired. Please log in again.');
        return;
      }
      const response = await fetch(`http://localhost:3000/api/brands/${deleteBrandId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setShowDeleteModal(false);
        setDeleteBrandId(null);
        fetchBrands();
      } else {
        setDeleteError(result?.error?.message || result?.message || "Failed to delete brand.");
      }
    } catch (error) {
      setDeleteError("Failed to delete brand.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="fw-bold">Brands</h3>
          <p className="text-muted">Manage all your brands here</p>
        </div>
        <Button variant="success" onClick={() => { setShowModal(true); setEditMode(false); setNewBrandName(""); setAddError(""); }}>
          + Add Brand
        </Button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">
        <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
          <span>Show</span>
          <Form.Select
            size="sm"
            style={{ width: 80 }}
            value={brandsPerPage}
            onChange={handleEntriesChange}
          >
            {ENTRIES_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Form.Select>
          <span>entries</span>
        </div>
        <InputGroup style={{ maxWidth: 250 }}>
          <Form.Control
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            size="sm"
          />
        </InputGroup>
      </div>

      <div className="table-responsive">
        <Table bordered hover>
          <thead className="table-light">
            <tr>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("id")}># {renderSortIcon("id")}</th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>Brand Name {renderSortIcon("name")}</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedBrands.length > 0 ? (
              sortedBrands.map((brand, index) => (
                <tr key={brand.id}>
                  <td>{(currentPage - 1) * brandsPerPage + index + 1}</td>
                  <td>{brand.name}</td>
                  <td>{brand.status}</td>
                  <td>{brand.createdAt}</td>
                  <td>{brand.updatedAt}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => openEditModal(brand)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openDeleteModal(brand.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No brands found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === currentPage}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      {/* Add/Edit Brand Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setNewBrandName(""); setAddError(""); setEditError(""); setEditMode(false); setEditBrandId(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Brand" : "Add Brand"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={editMode ? handleEditBrand : handleAddBrand}>
          <Modal.Body>
            {addError && !editMode && <Alert variant="danger">{addError}</Alert>}
            {editError && editMode && <Alert variant="danger">{editError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Brand Name</Form.Label>
              <Form.Control
                type="text"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                placeholder="Enter brand name"
                autoFocus
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setNewBrandName(""); setAddError(""); setEditError(""); setEditMode(false); setEditBrandId(null); }}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={adding}>
              {adding ? <Spinner animation="border" size="sm" /> : (editMode ? "Update" : "Save")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Brand Modal */}
      <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false); setDeleteBrandId(null); setDeleteError(""); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Brand</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this brand?
          {deleteError && <Alert variant="danger" className="mt-2">{deleteError}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowDeleteModal(false); setDeleteBrandId(null); setDeleteError(""); }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteBrand} disabled={deleteLoading}>
            {deleteLoading ? <Spinner animation="border" size="sm" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Brand;