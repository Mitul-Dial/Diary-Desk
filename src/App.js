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
  const [authKey, setAuthKey] = useState(0); // Key to force remounting

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  // Function to refresh the app state after auth changes
  const refreshAuthState = () => {
    setAuthKey(prev => prev + 1);
  };

  // Listen for storage changes (when token is set/removed)
  useEffect(() => {
    const handleStorageChange = () => {
      refreshAuthState();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Apply theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.classList.add('dark-mode');
    }
  }, []);

  return (
    <>
      <NoteState key={authKey}>
        <Router>
          <Navbar refreshAuthState={refreshAuthState} />
          <Alert alert={alert}/>
          <div className="container-fluid my-4">
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
              {/* Catch all route - redirect to home or login */}
              <Route 
                path="*" 
                element={
                  localStorage.getItem('token') ? 
                    <Home showAlert={showAlert} key={authKey} /> : 
                    <Login showAlert={showAlert} refreshAuthState={refreshAuthState} />
                } 
              />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;