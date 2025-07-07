import React, { useState, useEffect } from "react";
import { Container, Table, Form, InputGroup, Pagination, Modal, Button, Spinner, Alert } from "react-bootstrap";

const ENTRIES_OPTIONS = [5, 10, 25, 50];

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  notes: "",
  birthDate: "",
  status: "active"
};

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editMode, setEditMode] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [formValidationError, setFormValidationError] = useState("");

  // Fetch customers from backend
  const fetchCustomers = async () => {
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
        search,
        status: 'active'
      });
      const response = await fetch(`http://localhost:3000/api/customers?${params.toString()}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setCustomers(result.data.customers || []);
        setTotalCustomers(result.data.pagination?.total || (result.data.customers || []).length);
      } else {
        setError(result?.error?.message || "Failed to fetch customers.");
      }
    } catch (err) {
      setError("Failed to fetch customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [currentPage, entriesPerPage, search]);

  // Pagination
  const totalPages = Math.ceil(totalCustomers / entriesPerPage);

  // Add Customer
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setFormValidationError("");
    setActionError("");
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormValidationError("First name and last name are required.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setFormValidationError("Phone number must be exactly 10 digits.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setFormValidationError("Please enter a valid email address.");
      return;
    }
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setActionError('Session expired. Please log in again.');
        setActionLoading(false);
        return;
      }
      const response = await fetch("http://localhost:3000/api/customers", {
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
        setFormData(initialForm);
        fetchCustomers();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to add customer.");
      }
    } catch (err) {
      setActionError("Failed to add customer.");
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Customer
  const handleEditCustomer = (cust) => {
    setEditMode(true);
    setEditCustomerId(cust.id);
    setFormData({
      firstName: cust.firstName || "",
      lastName: cust.lastName || "",
      email: cust.email || "",
      phone: cust.phone || "",
      address: cust.address || "",
      city: cust.city || "",
      state: cust.state || "",
      zipCode: cust.zipCode || "",
      country: cust.country || "",
      notes: cust.notes || "",
      birthDate: cust.birthDate || "",
      status: cust.status || "active"
    });
    setShowModal(true);
    setActionError("");
  };

  // Update Customer
  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    setFormValidationError("");
    setActionError("");
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormValidationError("First name and last name are required.");
      return;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setFormValidationError("Phone number must be exactly 10 digits.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setFormValidationError("Please enter a valid email address.");
      return;
    }
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setActionError('Session expired. Please log in again.');
        setActionLoading(false);
        return;
      }
      const response = await fetch(`http://localhost:3000/api/customers/${editCustomerId}`, {
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
        setEditCustomerId(null);
        setFormData(initialForm);
        fetchCustomers();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to update customer.");
      }
    } catch (err) {
      setActionError("Failed to update customer.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Customer
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
      const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchCustomers();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to delete customer.");
      }
    } catch (err) {
      setActionError("Failed to delete customer.");
    } finally {
      setActionLoading(false);
    }
  };

  // Table row rendering
  const renderRow = (cust, index) => (
    <tr key={cust.id}>
      <td>{(currentPage - 1) * entriesPerPage + index + 1}</td>
      <td>{cust.firstName}</td>
      <td>{cust.lastName}</td>
      <td>{cust.email}</td>
      <td>{cust.phone}</td>
      <td>{cust.address ? (cust.address.length > 20 ? cust.address.slice(0, 20) + '...' : cust.address) : '-'}</td>
      <td>{cust.city}</td>
      <td>{cust.state}</td>
      <td>{cust.zipCode}</td>
      <td>{cust.country}</td>
      <td>{cust.notes ? (cust.notes.length > 20 ? cust.notes.slice(0, 20) + '...' : cust.notes) : '-'}</td>
      <td>{cust.birthDate ? new Date(cust.birthDate).toLocaleDateString() : '-'}</td>
      <td>{cust.status}</td>
      <td>{cust.createdAt ? new Date(cust.createdAt).toLocaleDateString() : '-'}</td>
      <td>
        <Button size="sm" variant="primary" className="me-2" onClick={() => handleEditCustomer(cust)}>
          Edit
        </Button>
        <Button size="sm" variant="danger" onClick={() => handleDelete(cust.id)} disabled={actionLoading}>
          Delete
        </Button>
      </td>
    </tr>
  );

  return (
    <Container fluid className="p-4">
      <h3 className="mb-3">Customers</h3>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <InputGroup style={{ maxWidth: "400px" }}>
          <InputGroup.Text>Search</InputGroup.Text>
          <Form.Control
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
        <div>
          <Button variant="success" onClick={() => { setShowModal(true); setEditMode(false); setFormData(initialForm); setActionError(""); }}>
            + Add Customer
          </Button>
        </div>
      </div>
      <div className="mb-2">
        <span>Show </span>
        <Form.Select
          size="sm"
          style={{ width: 80, display: "inline-block" }}
          value={entriesPerPage}
          onChange={e => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
        >
          {ENTRIES_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Form.Select>
        <span> entries</span>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {actionError && <Alert variant="danger">{actionError}</Alert>}
      <div className="table-responsive">
        <Table bordered hover className="align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>City</th>
              <th>State</th>
              <th>Zip Code</th>
              <th>Country</th>
              <th>Notes</th>
              <th>Birth Date</th>
              <th>Status</th>
              <th>Registration Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={15} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
            ) : customers.length > 0 ? (
              customers.map(renderRow)
            ) : (
              <tr>
                <td colSpan={15}>No customers found</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      {/* Pagination */}
      <Pagination className="mt-3">
        <Pagination.Prev onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item
            key={idx + 1}
            active={idx + 1 === currentPage}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} />
      </Pagination>
      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditMode(false); setEditCustomerId(null); setFormData(initialForm); setActionError(""); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Customer" : "Add Customer"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={editMode ? handleUpdateCustomer : handleAddCustomer}>
          <Modal.Body>
            {formValidationError && <Alert variant="danger">{formValidationError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control
                type="text"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Zip Code</Form.Label>
              <Form.Control
                type="text"
                value={formData.zipCode}
                onChange={e => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                value={formData.country}
                onChange={e => setFormData({ ...formData, country: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Birth Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.birthDate}
                onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditMode(false); setEditCustomerId(null); setFormData(initialForm); setActionError(""); }}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={actionLoading}>
              {actionLoading ? <Spinner animation="border" size="sm" /> : (editMode ? "Update" : "Save")}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Customers;
