import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = ({ refreshAuthState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  let navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setDropdownOpen(false);
    if (refreshAuthState) {
      refreshAuthState();
    }
    navigate('/login');
  }
  
  let location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token');

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav style={{
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'all var(--transition-normal)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>
        {/* Brand */}
        <Link 
          to="/" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            fontSize: 'var(--text-xl)',
            fontWeight: '600',
            color: 'var(--color-primary)',
            textDecoration: 'none',
            transition: 'color var(--transition-fast)'
          }}
          onMouseOver={(e) => e.target.style.color = 'var(--color-primary-dark)'}
          onMouseOut={(e) => e.target.style.color = 'var(--color-primary)'}
        >
          <i className="fas fa-sticky-note"></i>
          Diary Desk
        </Link>

        {/* Desktop Navigation */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-lg)',
          '@media (max-width: 768px)': {
            display: 'none'
          }
        }} className="desktop-nav">
          {isLoggedIn && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)'
            }}>
              <Link
                to="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  color: location.pathname === "/" ? 'var(--color-primary)' : 'var(--color-text)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-fast)',
                  fontWeight: location.pathname === "/" ? '500' : '400'
                }}
                onMouseOver={(e) => {
                  if (location.pathname !== "/") {
                    e.target.style.backgroundColor = 'var(--color-background)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <i className="fas fa-home"></i>Home
              </Link>
              <Link
                to="/about"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  color: location.pathname === "/about" ? 'var(--color-primary)' : 'var(--color-text)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-fast)',
                  fontWeight: location.pathname === "/about" ? '500' : '400'
                }}
                onMouseOver={(e) => {
                  if (location.pathname !== "/about") {
                    e.target.style.backgroundColor = 'var(--color-background)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                <i className="fas fa-info-circle"></i>About
              </Link>
            </div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)'
          }}>
            <DarkModeToggle />

            {!isLoggedIn ? (
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-sm)'
              }}>
                <Link className="btn btn-outline-primary" to="/login">
                  <i className="fas fa-sign-in-alt"></i>Login
                </Link>
                <Link className="btn btn-primary" to="/signup">
                  <i className="fas fa-user-plus"></i>Signup
                </Link>
              </div>
            ) : (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary"
                  onClick={toggleDropdown}
                  style={{
                    position: 'relative'
                  }}
                >
                  <i className="fas fa-user-circle"></i>
                  Account
                  <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`} style={{marginLeft: 'var(--spacing-xs)'}}></i>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu" style={{display: 'block'}}>
                    <Link className="dropdown-item" to="/profile" onClick={() => setDropdownOpen(false)}>
                      <i className="fas fa-user-cog"></i>Profile
                    </Link>
                    <Link className="dropdown-item" to="/" onClick={() => setDropdownOpen(false)}>
                      <i className="fas fa-sticky-note"></i>My Notes
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout} style={{color: 'var(--color-error)'}}>
                      <i className="fas fa-sign-out-alt"></i>Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          style={{
            display: 'none',
            '@media (max-width: 768px)': {
              display: 'flex'
            },
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          className="mobile-menu-btn"
          onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-background)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div style={{
          display: 'none',
          '@media (max-width: 768px)': {
            display: 'block'
          },
          borderTop: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          padding: 'var(--spacing-md) 0',
          animation: 'slideIn 0.2s ease-out'
        }} className="mobile-nav">
          <div className="container" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)'
          }}>
            {isLoggedIn && (
              <>
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    color: location.pathname === "/" ? 'var(--color-primary)' : 'var(--color-text)',
                    textDecoration: 'none',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: location.pathname === "/" ? 'var(--color-primary-light)' : 'transparent',
                    fontWeight: location.pathname === "/" ? '500' : '400'
                  }}
                >
                  <i className="fas fa-home"></i>Home
                </Link>
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    color: location.pathname === "/about" ? 'var(--color-primary)' : 'var(--color-text)',
                    textDecoration: 'none',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: location.pathname === "/about" ? 'var(--color-primary-light)' : 'transparent',
                    fontWeight: location.pathname === "/about" ? '500' : '400'
                  }}
                >
                  <i className="fas fa-info-circle"></i>About
                </Link>
                <div style={{height: '1px', backgroundColor: 'var(--color-border)', margin: 'var(--spacing-sm) 0'}}></div>
              </>
            )}

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
              padding: '0 var(--spacing-md)'
            }}>
              <DarkModeToggle />

              {!isLoggedIn ? (
                <>
                  <Link className="btn btn-outline-primary" to="/login" onClick={closeMobileMenu} style={{justifyContent: 'center'}}>
                    <i className="fas fa-sign-in-alt"></i>Login
                  </Link>
                  <Link className="btn btn-primary" to="/signup" onClick={closeMobileMenu} style={{justifyContent: 'center'}}>
                    <i className="fas fa-user-plus"></i>Signup
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/profile" 
                    onClick={closeMobileMenu}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <i className="fas fa-user-cog"></i>Profile
                  </Link>
                  <Link 
                    to="/" 
                    onClick={closeMobileMenu}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      color: 'var(--color-text)',
                      textDecoration: 'none',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <i className="fas fa-sticky-note"></i>My Notes
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-sm)',
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      color: 'var(--color-error)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: 'var(--text-base)'
                    }}
                  >
                    <i className="fas fa-sign-out-alt"></i>Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;