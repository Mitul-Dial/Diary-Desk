import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = (props) => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (credentials.password !== credentials.cpassword) {
      props.showAlert("Passwords do not match", "danger");
      return;
    }

    // Check password length
    if (credentials.password.length < 5) {
      props.showAlert("Password must be at least 5 characters long", "danger");
      return;
    }

    setLoading(true);

    try {
      const { name, email, password } = credentials;
      const response = await fetch("http://localhost:5000/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
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
          
          props.showAlert("Account created successfully", "success");
          navigate("/");
        } else {
          console.error('No token received:', json);
          props.showAlert("Account created but no token received", "warning");
        }
      } else {
        props.showAlert(json.error || json.message || "Invalid details", "danger");
      }
    } catch (error) {
      console.error('Signup error:', error);
      props.showAlert("Signup failed. Please try again.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header text-center bg-success text-white">
              <h2 className="mb-0">
                <i className="fas fa-user-plus me-2"></i>Create Account
              </h2>
              <p className="mb-0 mt-2">Join Diary Desk today!</p>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    <i className="fas fa-user me-2"></i>Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={credentials.name}
                    onChange={onChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="fas fa-envelope me-2"></i>Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={onChange}
                    placeholder="Enter your email"
                    required
                  />
                  <div className="form-text">
                    We'll never share your email with anyone else.
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="fas fa-lock me-2"></i>Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={onChange}
                    placeholder="Enter password (min 5 characters)"
                    minLength={5}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cpassword" className="form-label">
                    <i className="fas fa-check-circle me-2"></i>Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="cpassword"
                    name="cpassword"
                    value={credentials.cpassword}
                    onChange={onChange}
                    placeholder="Confirm your password"
                    minLength={5}
                    required
                  />
                  {/* Password Match Indicator */}
                  {credentials.password && credentials.cpassword && (
                    <div className="form-text">
                      {credentials.password === credentials.cpassword ? (
                        <span className="text-success">
                          <i className="fas fa-check me-1"></i>Passwords match
                        </span>
                      ) : (
                        <span className="text-danger">
                          <i className="fas fa-times me-1"></i>Passwords don't match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg"
                    disabled={
                      loading || 
                      !credentials.name || 
                      !credentials.email || 
                      !credentials.password || 
                      !credentials.cpassword ||
                      credentials.password !== credentials.cpassword ||
                      credentials.password.length < 5
                    }
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-user-plus me-2"></i>Create Account
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account? 
                  <Link to="/login" className="text-decoration-none ms-1">
                    <i className="fas fa-sign-in-alt me-1"></i>Login here
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

export default Signup;