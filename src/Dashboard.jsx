import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";
import Categories from "./Categories";
import Brand from "./Brand";
import Products from "./Products";
import ProductOffers from "./ProductOffers";
import ComboOffers from "./ComboOffers";
import DealerOffers from "./DealerOffers";
import ProductUpload from "./ProductUpload";
import Dealers from "./Dealers";
import DealersDeadlines from "./DealersDeadlines";
import DealerOrders from "./DealerOrders";
import Customers from "./Customers";
import CustomerOrders from "./CustomerOrders";
import BlockUsers from "./BlockUsers";
import Reports from "./Reports";
import Notifications from "./Notifications";
import Shipping from "./Shipping";
import Roles from "./Roles";
import ChangePassword from "./ChangePassword";
import Subcategory from "./Subcategory";
import { useState, useEffect } from "react";

const DemoPage = ({ title, desc }) => (
  <div style={{ padding: '2rem' }}>
    <h2>{title}</h2>
    <p>{desc}</p>
  </div>
);

const Dashboard = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };


  return (
    <div className={`container-fluid `}>
      <div className="row">
        <div
          className={`side-bar p-3 d-none d-lg-block ${
            isSidebarCollapsed ? "col-lg-1 collapsed" : "col-lg-3"
          }`}
        >
          <Sidebar isCollapsed={isSidebarCollapsed} />
        </div>
        <div
          className={`dashboard-section ${
            isSidebarCollapsed ? "col-lg-11" : "col-lg-9"
          }`}
        >
          <Header toggleSidebar={toggleSidebar}  />
          <main className="pt-3" >
            <Routes>
              <Route path="" element={<DashboardHome />} />
              <Route path="categories" element={<Categories />} />
              <Route path="subcategories" element={<Subcategory />} />
              <Route path="brands" element={<Brand />} />
              <Route path="products" element={<Products />} />
              <Route path="product-offers" element={<ProductOffers/>} />
              <Route path="combo-offers" element={<ComboOffers />} />
              <Route path="dealer-offers" element={<DealerOffers />} />
              <Route path="upload-excel" element={<ProductUpload />} />
              <Route path="dealers" element={<Dealers />} />
              <Route path="dealer-deadlines" element={<DealersDeadlines />} />
              <Route path="dealer-orders" element={<DealerOrders />} />
              <Route path="customers" element={<Customers/>} />
              <Route path="customer-orders" element={<CustomerOrders/>} />
              <Route path="block-users" element={<BlockUsers />} />
              <Route path="reports" element={<Reports/>} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="shipping" element={<Shipping />} />
              <Route path="roles" element={<Roles />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
