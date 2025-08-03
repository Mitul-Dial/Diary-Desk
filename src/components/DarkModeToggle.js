import React, { useState, useEffect } from "react";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      applyTheme(savedTheme === 'dark');
    } else if (prefersDark) {
      setDarkMode(true);
      applyTheme(true);
    }
  }, []);

  const applyTheme = (isDark) => {
    if (isDark) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      document.body.classList.remove('dark-mode');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
    applyTheme(newDarkMode);
  };

  return (
    <button
      className="btn btn-outline-secondary btn-sm"
      onClick={toggleDarkMode}
      title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
    >
      <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} me-1`}></i>
      {darkMode ? 'Light' : 'Dark'}
    </button>
  );
};

// CSS for dark mode - this would typically be in a separate CSS file
const darkModeStyles = `
  .dark-mode {
    background-color: #1a1a1a !important;
    color: #ffffff !important;
  }

  .dark-mode .card {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
    color: #ffffff !important;
  }

  .dark-mode .card-header {
    background-color: #404040 !important;
    border-color: #404040 !important;
  }

  .dark-mode .card-footer {
    background-color: #404040 !important;
    border-color: #404040 !important;
  }

  .dark-mode .form-control {
    background-color: #404040 !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }

  .dark-mode .form-control:focus {
    background-color: #404040 !important;
    border-color: #007bff !important;
    color: #ffffff !important;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25) !important;
  }

  .dark-mode .form-select {
    background-color: #404040 !important;
    border-color: #555555 !important;
    color: #ffffff !important;
  }

  .dark-mode .form-select:focus {
    background-color: #404040 !important;
    border-color: #007bff !important;
    color: #ffffff !important;
  }

  .dark-mode .btn-outline-primary {
    color: #007bff !important;
    border-color: #007bff !important;
  }

  .dark-mode .btn-outline-primary:hover {
    background-color: #007bff !important;
    color: #ffffff !important;
  }

  .dark-mode .btn-outline-secondary {
    color: #6c757d !important;
    border-color: #6c757d !important;
  }

  .dark-mode .btn-outline-secondary:hover {
    background-color: #6c757d !important;
    color: #ffffff !important;
  }

  .dark-mode .btn-outline-danger {
    color: #dc3545 !important;
    border-color: #dc3545 !important;
  }

  .dark-mode .btn-outline-danger:hover {
    background-color: #dc3545 !important;
    color: #ffffff !important;
  }

  .dark-mode .navbar-dark {
    background-color: #000000 !important;
  }

  .dark-mode .modal-content {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
  }

  .dark-mode .modal-header {
    border-color: #404040 !important;
  }

  .dark-mode .modal-footer {
    border-color: #404040 !important;
  }

  .dark-mode .alert-primary {
    background-color: #0d6efd20 !important;
    border-color: #0d6efd !important;
    color: #6ea8fe !important;
  }

  .dark-mode .alert-success {
    background-color: #19875420 !important;
    border-color: #198754 !important;
    color: #75b798 !important;
  }

  .dark-mode .alert-danger {
    background-color: #dc354520 !important;
    border-color: #dc3545 !important;
    color: #ea868f !important;
  }

  .dark-mode .alert-warning {
    background-color: #ffc10720 !important;
    border-color: #ffc107 !important;
    color: #ffda6a !important;
  }

  .dark-mode .alert-info {
    background-color: #0dcaf020 !important;
    border-color: #0dcaf0 !important;
    color: #6edff6 !important;
  }

  .dark-mode .text-muted {
    color: #adb5bd !important;
  }

  .dark-mode .border {
    border-color: #404040 !important;
  }

  .dark-mode .dropdown-menu {
    background-color: #2d2d2d !important;
    border-color: #404040 !important;
  }

  .dark-mode .dropdown-item {
    color: #ffffff !important;
  }

  .dark-mode .dropdown-item:hover {
    background-color: #404040 !important;
    color: #ffffff !important;
  }

  .dark-mode .nav-tabs .nav-link {
    color: #adb5bd !important;
  }

  .dark-mode .nav-tabs .nav-link.active {
    background-color: #007bff !important;
    color: #ffffff !important;
    border-color: #007bff !important;
  }

  .dark-mode .nav-tabs .nav-link:hover {
    background-color: #404040 !important;
    color: #ffffff !important;
  }

  .dark-mode .progress {
    background-color: #404040 !important;
  }

  /* Rich Text Editor Dark Mode */
  .dark-mode .btn-toolbar {
    background-color: #404040 !important;
    border-color: #555555 !important;
  }

  .dark-mode .form-control[contenteditable] {
    background-color: #404040 !important;
    color: #ffffff !important;
  }

  .dark-mode .form-control[contenteditable]:empty:before {
    color: #adb5bd !important;
  }

  /* Note Cards Dark Mode */
  .dark-mode .note-card:hover {
    box-shadow: 0 4px 8px rgba(255,255,255,0.1) !important;
  }

  /* Stats Cards Dark Mode */
  .dark-mode .stat-item:hover {
    background-color: #404040 !important;
  }
`;

// Inject dark mode styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = darkModeStyles;
  document.head.appendChild(styleElement);
}

export default DarkModeToggle;