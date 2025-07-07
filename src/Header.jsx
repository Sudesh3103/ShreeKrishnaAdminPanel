import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";

export default function Header({ toggleSidebar }) {
  const [isFullScreen, setFullScreen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleFullscreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
      setFullScreen(true);
    } else {
      document.exitFullscreen();
      setFullScreen(false);
    }
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    if (isProfileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <>
      <div className="header-main d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <button
            className="header-icon-btn d-lg-none me-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#mobileSidebar"
            aria-controls="mobileSidebar"
            aria-label="Open sidebar"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <div className="d-lg-none">
            <img src="\images\ipmsgclip_s_1751012414_0.png" alt="" style={{ width: 150, height: 50 }} />
          </div>
          <div className="d-none d-lg-block" onClick={toggleSidebar}>
            <i className="bi bi-list-nested fs-2 text-primary"></i>
          </div>
          <input type="search" placeholder="Search anything here..." className="header-search ms-3 d-none d-md-block" />
        </div>
        <div className="header-profile d-flex align-items-center">
          <button className="header-icon-btn d-none d-md-inline" onClick={handleFullscreen}>
            <i className={`fa-solid ${isFullScreen ? 'fa-compress' : 'fa-maximize'}`}></i>
          </button>
          <div className="profile-dropdown-container position-relative" ref={dropdownRef}>
            <img
              src="/images/user.png"
              alt="Profile"
              className="header-profile-img ms-2"
              onClick={toggleProfileDropdown}
              style={{ cursor: "pointer", borderRadius: "50%", width: 40, height: 40, objectFit: "cover",  }}
            />
            {isProfileDropdownOpen && (
              <div className="profile-dropdown position-absolute bg-white shadow-sm rounded p-2" style={{ minWidth: 140, right: 0, top: 50, zIndex: 100 }}>
                <a href="/" className="dropdown-item text-danger" style={{ fontWeight: 600 }}>
                  <i className="fa-solid fa-right-from-bracket me-2"></i>Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div
        className="offcanvas offcanvas-start d-lg-none"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileSidebarLabel">Menu</h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body p-0">
          <Sidebar isCollapsed={false} />
        </div>
      </div>
      <style>{`
        .header-profile-img {
          box-shadow: 0 2px 8px rgba(25, 118, 210, 0.10);
          transition: box-shadow 0.2s, border 0.2s;
        }
        .header-profile-img:hover {
          box-shadow: 0 4px 16px rgba(25, 118, 210, 0.18);
          border-color: #125ea2;
        }
        .profile-dropdown {
          min-width: 140px;
          right: 0;
          top: 50px;
          z-index: 100;
          border: 1px solid #e3f2fd;
        }
        .dropdown-item {
          padding: 10px 18px;
          border-radius: 6px;
          color: #1976d2;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .dropdown-item:hover {
          background: #e3f2fd;
          color: #d32f2f;
        }
      `}</style>
    </>
  );
}
