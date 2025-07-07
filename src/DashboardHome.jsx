import { useNavigate } from "react-router-dom";

function DashboardHome() {
  const navigate = useNavigate();

  // Mock recent orders data
  const recentOrders = [
    { id: 'ORD2001', customer: 'John Doe', amount: 1500, status: 'Delivered', date: '2024-07-01' },
    { id: 'ORD2002', customer: 'Jane Smith', amount: 900, status: 'Processing', date: '2024-07-02' },
    { id: 'ORD2003', customer: 'Alice Brown', amount: 1200, status: 'Pending', date: '2024-07-03' },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Welcome back, admin!</h2>
          <p className="text-muted">Dashboard</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="row">
            {/* Stat Cards */}
            <div className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-box-open fs-2 text-primary"></i>
                    <div className="ms-3">
                      <p className="mb-0 text-muted">Total Products</p>
                      <h5 className="mb-0">1</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-shopping-cart fs-2 text-success"></i>
                    <div className="ms-3">
                      <p className="mb-0 text-muted">Total Orders</p>
                      <h5 className="mb-0">0</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-hourglass-half fs-2 text-warning"></i>
                    <div className="ms-3">
                      <p className="mb-0 text-muted">Processing Orders</p>
                      <h5 className="mb-0">0</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-rupee-sign fs-2 text-info"></i>
                    <div className="ms-3">
                      <p className="mb-0 text-muted">Total Revenue</p>
                      <h5 className="mb-0">₹0.00</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-layer-group fs-2 text-secondary"></i>
                    <div className="ms-3">
                      <p className="mb-0 text-muted">Categories</p>
                      <h5 className="mb-0">1</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-tags fs-2 text-danger"></i>
                    <div className="ms-3">
                      <p className="mb-0 text-muted">Active Coupons</p>
                      <h5 className="mb-0">0</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-calendar-day fs-2 text-primary"></i>
                    <div className="ms-3">
                      <p className="mb-0 text-muted">Today's Orders</p>
                      <h5 className="mb-0">0</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <i className="fa-solid fa-users fs-2 text-success"></i>
                    <div className="ms-3">
                      <p className="mb-0 text-muted">Total Users</p>
                      <h5 className="mb-0">3</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
        </div>

        <div className="row">
          {/* Recent Orders */}
          <div className="col-12 col-md-8  ">
            <div className="border">
              <h5 className="card-title">Recent Orders</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Name</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>&#8377;{order.amount}</td>
                        <td>{order.status}</td>
                        <td>{order.date}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">No orders found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="col-12 col-md-4  mb-4 ">
            <div className="border">
              <h5 className="card-title mb-2">Quick Actions</h5>
              <button className="btn btn-primary w-100 mb-2" onClick={() => navigate('/dashboard/products')}>Add New Product</button>
              <button className="btn btn-secondary w-100 mb-2" onClick={() => navigate('/dashboard/product-offers')}>Create Coupon</button>
            </div>
          </div>

          
        </div>

        <div className="row mt-3">
          {/* Order Status Summary */}
          <div className="col-12 col-md-8  mb-4">
            <div className="border">
              <h5 className="card-title">Order Status Summary</h5>
              <p>No orders found</p>
            </div>
          </div>

          {/* Recent Blog Posts */}
          <div className="col-12 col-md-4 ">
            <div className="border">
              <h5 className="card-title">Recent Blog Posts</h5>
              <p>No posts found</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardHome;
