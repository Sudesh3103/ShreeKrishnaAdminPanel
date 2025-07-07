import React, { useState } from "react";
import { Container, Form, Table, Button, Alert } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";

const ProductUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".csv")) {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Please select a CSV file to upload.");
    }
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please select a CSV file to upload.");
      return;
    }
    // handle upload logic here
    alert("CSV uploaded successfully!");
  };

  return (
    <Container className="my-4">
      <h3 className="fw-bold">Add Products in Bulk</h3>
      <p>Import Products from CSV</p>

      <Alert variant="info">
        <strong>Important:</strong> Please use CSV format for importing products.
        Categories and subcategories will be automatically created if they don't exist.
      </Alert>

      <Button variant="warning" className="mb-3">
        <FaDownload className="me-2" /> Download CSV Template
      </Button>

      <h5 className="fw-bold">CSV File Structure</h5>
      <Table striped bordered responsive>
        <thead>
          <tr>
            <th>Column</th>
            <th>Description</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Product Name</td><td>Name of the product</td><td className="text-danger">Yes</td></tr>
          <tr><td>Main Category</td><td>Main category of the product</td><td className="text-danger">Yes</td></tr>
          <tr><td>Subcategory</td><td>Subcategory of the product</td><td className="text-danger">Yes</td></tr>
          <tr><td>Description</td><td>Product description</td><td>No</td></tr>
          <tr><td>Tax %</td><td>Tax percentage</td><td>No</td></tr>
          <tr><td>Availability</td><td>"In Stock" or "Out of Stock"</td><td>No (Default: In Stock)</td></tr>
          <tr><td>Has Offer</td><td>"Yes" or "No"</td><td>No (Default: No)</td></tr>
          <tr><td>Offer Percentage</td><td>Only if Has Offer is "Yes"</td><td>Conditional</td></tr>
          <tr><td>Sale Price</td><td>Sale price of the product</td><td className="text-danger">Yes</td></tr>
          <tr><td>MRP</td><td>Maximum retail price</td><td className="text-danger">Yes</td></tr>
          <tr><td>Image Path</td><td>Optional image path</td><td>No</td></tr>
          <tr><td>Category Image</td><td>Optional category image path</td><td>No</td></tr>
        </tbody>
      </Table>

      <Form.Group controlId="csvFile" className="mb-3">
        <Form.Label>Upload CSV File</Form.Label>
        <Form.Control type="file" accept=".csv" onChange={handleFileChange} />
        {error && <div className="text-danger mt-1">{error}</div>}
      </Form.Group>

      <Button variant="success" onClick={handleUpload}>
        📂 Import Products
      </Button>

      <div className="mt-4">
        <h5 className="fw-bold">Instructions</h5>
        <ul>
          <li>Use Excel or Google Sheets to create a new spreadsheet.</li>
          <li>Follow the column structure strictly.</li>
          <li>Save as CSV file format (Comma Separated Values).</li>
          <li>Do not open and save repeatedly in Excel as it may corrupt encoding.</li>
          <li>Maximum 500 products per upload recommended.</li>
          <li>Use FTP for batch image uploads and reference the correct path.</li>
        </ul>
        <Alert variant="primary" className="mt-3">
          Need to add a single product? Go to the <strong>Add Product</strong> page.
        </Alert>
      </div>
    </Container>
  );
};

export default ProductUpload;
