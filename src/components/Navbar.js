import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = ({ refreshAuthState }) => {
  let navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (refreshAuthState) {
      refreshAuthState();
    }
    navigate('/login');
  }
  let location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <i className="fas fa-sticky-note me-2"></i>
            Diary Desk
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                      aria-current="page"
                      to="/"
                    >
                      <i className="fas fa-home me-1"></i>Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${location.pathname === "/about" ? "active" : ""}`}
                      to="/about"
                    >
                      <i className="fas fa-info-circle me-1"></i>About
                    </Link>
                  </li>
                </>
              )}
            </ul>
            
            <div className="d-flex align-items-center">
              {/* Dark Mode Toggle */}
              <div className="me-3">
                <DarkModeToggle />
              </div>

              {!isLoggedIn ? (
                <div className="d-flex">
                  <Link className="btn btn-outline-light me-2" to="/login" role="button">
                    <i className="fas fa-sign-in-alt me-1"></i>Login
                  </Link>
                  <Link className="btn btn-primary" to="/signup" role="button">
                    <i className="fas fa-user-plus me-1"></i>Signup
                  </Link>
                </div>
              ) : (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-user-circle me-2"></i>
                    Account
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="fas fa-user-cog me-2"></i>Profile
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/">
                        <i className="fas fa-sticky-note me-2"></i>My Notes
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt me-2"></i>Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;