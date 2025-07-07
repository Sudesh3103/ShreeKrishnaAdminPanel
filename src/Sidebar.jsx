import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ isCollapsed }) {
  const [isSecurityOpen, setSecurityOpen] = useState(false);
  const [isCategoriesOpen, setCategoriesOpen] = useState(false);
  const location = useLocation();

  const toggleSecurityMenu = () => {
    setSecurityOpen(!isSecurityOpen);
  };

  const toggleCategoriesMenu = () => {
    setCategoriesOpen(!isCategoriesOpen);
  };

  // Handler to close offcanvas on mobile/tablet
  const handleNavLinkClick = () => {
    const offcanvas = document.getElementById('mobileSidebar');
    if (offcanvas && window.bootstrap && window.bootstrap.Offcanvas) {
      const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(offcanvas);
      if (bsOffcanvas) bsOffcanvas.hide();
    } else if (offcanvas && typeof bootstrap !== 'undefined' && bootstrap.Offcanvas) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
      if (bsOffcanvas) bsOffcanvas.hide();
    }
  };

  return (
    <section>
      <div className="sidebar-logo mb-3 mt-2">
      {!isCollapsed &&<img src="\images\ipmsgclip_s_1751012414_0.png" alt="logo" style={{ width: '100%', height: 'auto' }} />}
        {/* {!isCollapsed && <span className="ms-2">Admin</span>} */}
      </div>
      <hr className="sidebar-divider" />
      <div className="sidebar-section-title">{!isCollapsed && 'ADMIN PANEL'}</div>
      <NavLink to="/" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-right-to-bracket"></i>
        {!isCollapsed && <span>Admin Login</span>}
      </NavLink>
      <NavLink  to="/dashboard" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-chart-line"></i>
        {!isCollapsed && <span>Dashboard</span>}
      </NavLink>
      <hr className="sidebar-divider" />
      <div className="sidebar-section-title">{!isCollapsed && 'Manage'}</div>
      <div style={{ position: 'relative' }}>
        <NavLink to="/dashboard/categories" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
          <i className="fa-solid fa-folder"></i>
          {!isCollapsed && <span>Categories</span>}
        </NavLink>
        {!isCollapsed && (
          <span onClick={toggleCategoriesMenu} style={{ position: 'absolute', right: 18, top: 14, cursor: 'pointer', zIndex: 2 }}>
            <i className={`fa-solid fa-chevron-down ${isCategoriesOpen ? 'rotate-180' : ''}`}></i>
          </span>
        )}
        {isCategoriesOpen && !isCollapsed && (
          <div className="sidebar-submenu">
            <NavLink to="/dashboard/subcategories" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
              <i className="fa-solid fa-sitemap"></i>
              <span>Subcategories</span>
            </NavLink>
          </div>
        )}
      </div>
      <NavLink to="/dashboard/brands" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-copyright"></i>
        {!isCollapsed && <span>Brands</span>}
      </NavLink>
      <NavLink to="/dashboard/products" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-box"></i>
        {!isCollapsed && <span>Products</span>}
      </NavLink>
      <NavLink to="/dashboard/product-offers" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-tags"></i>
        {!isCollapsed && <span>Offers on Products</span>}
      </NavLink>
      <NavLink to="/dashboard/combo-offers" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-gift"></i>
        {!isCollapsed && <span>Combo Offers</span>}
      </NavLink>
      {/* Dealer-Specific Offers: Only visible to dealers */}
      <NavLink to="/dashboard/dealer-offers" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-user-tag"></i>
        {!isCollapsed && <span>Dealer-Specific Offers</span>}
      </NavLink>
      <NavLink to="/dashboard/upload-excel" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-file-excel"></i>
        {!isCollapsed && <span>Product Upload (Excel)</span>}
      </NavLink>
      <hr className="sidebar-divider" />
      <div className="sidebar-section-title">{!isCollapsed && 'Dealer Management'}</div>
      <NavLink to="/dashboard/dealers" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-users"></i>
        {!isCollapsed && <span>Dealers</span>}
      </NavLink>
      <NavLink to="/dashboard/dealer-deadlines" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-calendar-check"></i>
        {!isCollapsed && <span>Dealer Payment Deadlines</span>}
      </NavLink>
      <NavLink to="/dashboard/dealer-orders" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-boxes-packing"></i>
        {!isCollapsed && <span>Dealer Orders & Delivery</span>}
      </NavLink>
      <hr className="sidebar-divider" />
      <div className="sidebar-section-title">{!isCollapsed && 'Customer Management'}</div>
      <NavLink to="/dashboard/customers" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-user"></i>
        {!isCollapsed && <span>Customers</span>}
      </NavLink>
      <NavLink to="/dashboard/customer-orders" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-clipboard-list"></i>
        {!isCollapsed && <span>Customer Orders</span>}
      </NavLink>
      <NavLink to="/dashboard/block-users" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-user-slash"></i>
        {!isCollapsed && <span>Block/Activate Users</span>}
      </NavLink>
      <hr className="sidebar-divider" />
      <div className="sidebar-section-title">{!isCollapsed && 'Reports & Notifications'}</div>
      <NavLink to="/dashboard/reports" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-file-csv"></i>
        {!isCollapsed && <span>Reports & Export</span>}
      </NavLink>
      <NavLink to="/dashboard/notifications" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-bell"></i>
        {!isCollapsed && <span>Notifications</span>}
      </NavLink>
      <NavLink to="/dashboard/shipping" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-truck"></i>
        {!isCollapsed && <span>Shipping Tracking</span>}
      </NavLink>
      <NavLink to="/dashboard/roles" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
        <i className="fa-solid fa-user-shield"></i>
        {!isCollapsed && <span>Role-Based Admin Access</span>}
      </NavLink>
      <hr className="sidebar-divider" />
      <div className="sidebar-section-title">{!isCollapsed && 'System Settings'}</div>
      <div className={`sidebar-link ${isSecurityOpen ? 'open' : ''}`} onClick={toggleSecurityMenu}>
        <i className="fa-solid fa-shield-halved"></i>
        {!isCollapsed && <span>Security</span>}
        {!isCollapsed && <i className={`fa-solid fa-chevron-down float-end ${isSecurityOpen ? 'rotate-180' : ''}`}></i>}
      </div>
      {isSecurityOpen && !isCollapsed && (
        <div className="sidebar-submenu">
          <NavLink to="/dashboard/change-password" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}` } onClick={handleNavLinkClick}>
            <i className="fa-solid fa-key"></i>
            <span>Change Password</span>
          </NavLink>
        </div>
      )}
    </section>
  );
}