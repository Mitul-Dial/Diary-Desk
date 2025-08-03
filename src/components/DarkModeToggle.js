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
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
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
      onClick={toggleDarkMode}
      title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        padding: 'var(--spacing-sm) var(--spacing-md)',
        backgroundColor: 'transparent',
        color: 'var(--color-text-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        fontSize: 'var(--text-sm)',
        fontWeight: '500',
        transition: 'all var(--transition-fast)',
        minHeight: '40px'
      }}
      onMouseOver={(e) => {
        e.target.style.backgroundColor = 'var(--color-background)';
        e.target.style.borderColor = 'var(--color-primary)';
        e.target.style.color = 'var(--color-primary)';
      }}
      onMouseOut={(e) => {
        e.target.style.backgroundColor = 'transparent';
        e.target.style.borderColor = 'var(--color-border)';
        e.target.style.color = 'var(--color-text-secondary)';
      }}
      onMouseDown={(e) => {
        e.target.style.transform = 'scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.target.style.transform = 'scale(1)';
      }}
    >
      <i 
        className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}
        style={{
          fontSize: 'var(--text-base)',
          transition: 'transform var(--transition-fast)'
        }}
      ></i>
      <span>{darkMode ? 'Light' : 'Dark'}</span>
    </button>
  );
};

export default DarkModeToggle;