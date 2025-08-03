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
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-md)',
      background: 'linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-accent-light) 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        animation: 'scaleIn 0.5s ease-out'
      }}>
        <div className="card" style={{
          border: 'none',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div className="card-header" style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
            color: 'var(--color-white)',
            padding: 'var(--spacing-xl)'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-md)',
              opacity: 0.9
            }}>
              <i className="fas fa-sign-in-alt"></i>
            </div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              margin: 0,
              marginBottom: 'var(--spacing-sm)'
            }}>
              Welcome Back
            </h1>
            <p style={{
              margin: 0,
              opacity: 0.9,
              fontSize: 'var(--text-sm)'
            }}>
              Sign in to your Diary Desk account
            </p>
          </div>
          
          <div className="card-body" style={{ padding: 'var(--spacing-xl)' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
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
                  style={{
                    height: '48px',
                    fontSize: 'var(--text-base)'
                  }}
                />
              </div>
              
              <div className="form-group">
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
                  style={{
                    height: '48px',
                    fontSize: 'var(--text-base)'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading || !credentials.email || !credentials.password}
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: 'var(--text-base)',
                  fontWeight: '500',
                  background: loading ? 'var(--color-text-muted)' : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                  border: 'none'
                }}
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
            </form>

            <div style={{
              textAlign: 'center',
              marginTop: 'var(--spacing-lg)',
              padding: 'var(--spacing-md) 0',
              borderTop: '1px solid var(--color-border)'
            }}>
              <p style={{
                margin: 0,
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--text-sm)'
              }}>
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.target.style.color = 'var(--color-primary-dark)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--color-primary)'}
                >
                  <i className="fas fa-user-plus me-1"></i>Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'var(--color-accent)',
          borderRadius: '50%',
          opacity: 0.1,
          zIndex: -1,
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'var(--color-primary)',
          borderRadius: '50%',
          opacity: 0.1,
          zIndex: -1,
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Login;