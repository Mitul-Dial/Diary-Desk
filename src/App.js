import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState, useEffect } from "react";

function App() {
  const [alert, setAlert] = useState(null);
  const [authKey, setAuthKey] = useState(0); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
    return !!token;
  };

  const refreshAuthState = () => {
    setAuthKey(prev => prev + 1);
    setTimeout(() => {
      checkAuthStatus();
    }, 100); 
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        checkAuthStatus();
        refreshAuthState();
      }
    };

    const handleAuthChange = () => {
      checkAuthStatus();
      refreshAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
    }
  }, []);

  if (isLoading) {
    return (
      <div className="App" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '1.2rem'
      }}>
        <div>
          <i className="fas fa-spinner fa-spin me-2"></i>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <NoteState key={authKey} isAuthenticated={isAuthenticated}>
        <Router>
          <Navbar refreshAuthState={refreshAuthState} />
          <Alert alert={alert}/>
          <div className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={<Home showAlert={showAlert} key={authKey} />} 
              />
              <Route 
                path="/about" 
                element={<About />} 
              />
              <Route 
                path="/login" 
                element={
                  <Login 
                    showAlert={showAlert} 
                    refreshAuthState={refreshAuthState} 
                  />
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <Signup 
                    showAlert={showAlert} 
                    refreshAuthState={refreshAuthState} 
                  />
                } 
              />
              <Route 
                path="*" 
                element={
                  isAuthenticated ? 
                    <Home showAlert={showAlert} key={authKey} /> : 
                    <Login showAlert={showAlert} refreshAuthState={refreshAuthState} />
                } 
              />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </div>
  );
}

export default App;