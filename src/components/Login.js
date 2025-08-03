import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = (props) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const json = await response.json();
      console.log(json);
      
      if (json.success) {
        // Handle both possible token field names from backend
        const token = json.authtoken || json.authToken;
        if (token) {
          localStorage.setItem("token", token);

          if (props.refreshAuthState) {
            props.refreshAuthState();
          }

          props.showAlert("Logged in successfully", "success");
          navigate("/");
        } else {
          console.error('No token received:', json);
          props.showAlert("Login successful but no token received", "warning");
        }
      } else {
        props.showAlert(json.error || json.message || "Invalid credentials", "danger");
      }
    } catch (error) {
      console.error('Login error:', error);
      props.showAlert("Login failed. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header text-center bg-primary text-white">
              <h2 className="mb-0">
                <i className="fas fa-sign-in-alt me-2"></i>Login to Diary Desk
              </h2>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="fas fa-envelope me-2"></i>Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={credentials.email}
                    name="email"
                    onChange={onChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock me-2"></i>Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    id="password"
                    value={credentials.password}
                    onChange={onChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading || !credentials.email || !credentials.password}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>Sign In
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account? 
                  <Link to="/signup" className="text-decoration-none ms-1">
                    <i className="fas fa-user-plus me-1"></i>Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;