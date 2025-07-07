import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Modal, Button, Spinner, Alert, Form } from "react-bootstrap";

const ENTRIES_OPTIONS = [5, 10, 25, 50];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    dealerPrice: "",
    stock: "",
    categoryId: "",
    brandId: "",
    images: "",
    specifications: "",
    sku: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: entriesPerPage,
        search: searchTerm
      });
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/products?${params.toString()}`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      const result = await response.json();
      if (result.success) {
        setProducts(result.data.products || []);
        setTotalProducts(result.data.pagination?.total || (result.data.products || []).length);
      } else {
        setError(result?.error?.message || "Failed to fetch products.");
      }
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and brands for dropdowns
  const fetchCategoriesAndBrands = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        fetch("http://localhost:3000/api/categories"),
        fetch("http://localhost:3000/api/brands")
      ]);
      const catData = await catRes.json();
      const brandData = await brandRes.json();
      setCategories(catData.data?.categories || []);
      setBrands(brandData.data?.brands || []);
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesAndBrands();
    // eslint-disable-next-line
  }, [currentPage, entriesPerPage, searchTerm]);

  // Sorting logic (client-side for now)
  const sortedProducts = React.useMemo(() => {
    let sortable = [...products];
    if (searchTerm) {
      sortable = sortable.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku || "").toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [products, searchTerm, sortConfig]);

  // Pagination
  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(totalProducts / entriesPerPage);

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

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setActionError("");
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Convert images to array
      const imagesArr = formData.images.split(',').map(s => s.trim()).filter(Boolean);
      // Parse specifications JSON
      let specificationsObj = {};
      try { specificationsObj = formData.specifications ? JSON.parse(formData.specifications) : {}; } catch {}
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, images: imagesArr, specifications: specificationsObj })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setShowModal(false);
        setFormData({ name: "", description: "", price: "", dealerPrice: "", stock: "", categoryId: "", brandId: "", images: "", specifications: "", sku: "" });
        fetchProducts();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to add product.");
      }
    } catch (err) {
      setActionError("Failed to add product.");
    } finally {
      setActionLoading(false);
    }
  };

  // Edit Product
  const handleEditProduct = (prod) => {
    setEditMode(true);
    setEditProductId(prod.id);
    setFormData({
      name: prod.name || "",
      description: prod.description || "",
      price: prod.price || "",
      dealerPrice: prod.dealerPrice || "",
      stock: prod.stock || "",
      categoryId: prod.categoryId || "",
      brandId: prod.brandId || "",
      images: Array.isArray(prod.images) ? prod.images.join(', ') : (typeof prod.images === 'string' ? prod.images : ""),
      specifications: prod.specifications ? (typeof prod.specifications === 'string' ? prod.specifications : JSON.stringify(prod.specifications, null, 2)) : "",
      sku: prod.sku || ""
    });
    setShowModal(true);
    setActionError("");
  };

  // Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setActionError("");
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const imagesArr = formData.images.split(',').map(s => s.trim()).filter(Boolean);
      let specificationsObj = {};
      try { specificationsObj = formData.specifications ? JSON.parse(formData.specifications) : {}; } catch {}
      const response = await fetch(`http://localhost:3000/api/products/${editProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, images: imagesArr, specifications: specificationsObj })
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setShowModal(false);
        setEditMode(false);
        setEditProductId(null);
        setFormData({ name: "", description: "", price: "", dealerPrice: "", stock: "", categoryId: "", brandId: "", images: "", specifications: "", sku: "" });
        fetchProducts();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to update product.");
      }
    } catch (err) {
      setActionError("Failed to update product.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    setActionError("");
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok && result.success) {
        fetchProducts();
      } else {
        setActionError(result?.error?.message || result?.message || "Failed to delete product.");
      }
    } catch (err) {
      setActionError("Failed to delete product.");
    } finally {
      setActionLoading(false);
    }
  };

  // Get category/brand name by id
  const getCategoryName = (categoryId) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : "-";
  };
  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : "-";
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">Products</h1>
          <p className="text-muted mb-0">Manage all your products here</p>
        </div>
        <button className="btn btn-success d-flex align-items-center gap-2" onClick={() => { setShowModal(true); setEditMode(false); setFormData({ name: "", description: "", price: "", dealerPrice: "", stock: "", categoryId: "", brandId: "", images: "", specifications: "", sku: "" }); setActionError(""); }}>
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Controls */}
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
            placeholder="Search products..."
          />
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("id")}># {renderSortIcon("id")}</th>
              <th style={{ cursor: "pointer" }} onClick={() => handleSort("name")}>Name {renderSortIcon("name")}</th>
              <th>Description</th>
              <th>Price</th>
              <th>Dealer Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Brand</th>
              <th>SKU</th>
              <th>Images</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={12} className="text-center"><Spinner animation="border" size="sm" /></td></tr>
            ) : currentProducts.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center text-muted">No products found</td>
              </tr>
            ) : (
              currentProducts.map((product, index) => (
                <tr key={product.id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>{product.price}</td>
                  <td>{product.dealerPrice}</td>
                  <td>{product.stock}</td>
                  <td>{getCategoryName(product.categoryId)}</td>
                  <td>{getBrandName(product.brandId)}</td>
                  <td>{product.sku}</td>
                  <td>
                    {Array.isArray(product.images) && product.images.length > 0 ? (
                      <div style={{ display: 'flex', gap: 4 }}>
                        {product.images.map((img, i) => (
                          <img key={i} src={img} alt={product.name} className="rounded" width={32} height={32} />
                        ))}
                      </div>
                    ) : "No images"}
                  </td>
                  <td>{product.isActive ? "Active" : "Inactive"}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-primary" onClick={() => handleEditProduct(product)}>
                        <Edit size={16} />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)} disabled={actionLoading}>
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

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
        <small className="text-muted">
          Showing {sortedProducts.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, sortedProducts.length)} of {totalProducts} entries
        </small>
        <div className="btn-group">
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`btn btn-sm ${currentPage === i + 1 ? "btn-success text-white" : "btn-outline-secondary"}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => { setShowModal(false); setEditMode(false); setEditProductId(null); setFormData({ name: "", description: "", price: "", dealerPrice: "", stock: "", categoryId: "", brandId: "", images: "", specifications: "", sku: "" }); setActionError(""); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Product" : "Add Product"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={editMode ? handleUpdateProduct : handleAddProduct}>
          <Modal.Body>
            {actionError && <Alert variant="danger">{actionError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
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
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Enter price"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dealer Price</Form.Label>
              <Form.Control
                type="number"
                value={formData.dealerPrice}
                onChange={(e) => setFormData({ ...formData, dealerPrice: e.target.value })}
                placeholder="Enter dealer price"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="Enter stock"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={formData.categoryId || ""}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value ? Number(e.target.value) : "" })}
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Select
                value={formData.brandId || ""}
                onChange={(e) => setFormData({ ...formData, brandId: e.target.value ? Number(e.target.value) : "" })}
                required
              >
                <option value="">Select brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>SKU</Form.Label>
              <Form.Control
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Enter SKU"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Images (comma separated URLs)</Form.Label>
              <Form.Control
                type="text"
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="Enter image URLs, separated by commas"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Specifications (JSON)</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.specifications}
                onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                placeholder='{"color": "red", "weight": "1kg"}'
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); setEditMode(false); setEditProductId(null); setFormData({ name: "", description: "", price: "", dealerPrice: "", stock: "", categoryId: "", brandId: "", images: "", specifications: "", sku: "" }); setActionError(""); }}>
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
