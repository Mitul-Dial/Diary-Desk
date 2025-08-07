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
      
      if (json.success) {
        const token = json.authtoken || json.authToken;
        if (token) {
          localStorage.setItem("token", token);
          
          if (props.refreshAuthState) {
            props.refreshAuthState();
          }
          
          props.showAlert("Account created successfully", "success");
          navigate("/");
        } else {
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

  const passwordsMatch = credentials.password && credentials.cpassword && credentials.password === credentials.cpassword;
  const passwordsDontMatch = credentials.password && credentials.cpassword && credentials.password !== credentials.cpassword;

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-md)',
      background: 'linear-gradient(135deg, var(--color-success) 0%, var(--color-accent) 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        animation: 'scaleIn 0.5s ease-out'
      }}>
        <div className="card" style={{
          border: 'none',
          boxShadow: 'var(--shadow-xl)'
        }}>
          <div className="card-header" style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
            color: 'var(--color-white)',
            padding: 'var(--spacing-xl)'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: 'var(--spacing-md)',
              opacity: 0.9
            }}>
              <i className="fas fa-user-plus"></i>
            </div>
            <h1 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              margin: 0,
              marginBottom: 'var(--spacing-sm)'
            }}>
              Create Account
            </h1>
            <p style={{
              margin: 0,
              opacity: 0.9,
              fontSize: 'var(--text-sm)'
            }}>
              Join Diary Desk today!
            </p>
          </div>
          
          <div className="card-body" style={{ padding: 'var(--spacing-xl)' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
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
                  style={{
                    height: '48px',
                    fontSize: 'var(--text-base)'
                  }}
                />
              </div>

              <div className="form-group">
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
                  style={{
                    height: '48px',
                    fontSize: 'var(--text-base)'
                  }}
                />
                <div className="form-text">
                  We'll never share your email with anyone else.
                </div>
              </div>

              <div className="form-group">
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
                  style={{
                    height: '48px',
                    fontSize: 'var(--text-base)'
                  }}
                />
              </div>

              <div className="form-group">
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
                  style={{
                    height: '48px',
                    fontSize: 'var(--text-base)',
                    borderColor: passwordsDontMatch ? 'var(--color-error)' : passwordsMatch ? 'var(--color-success)' : 'var(--color-border)'
                  }}
                />
                {credentials.password && credentials.cpassword && (
                  <div className="form-text" style={{
                    color: passwordsMatch ? 'var(--color-success)' : 'var(--color-error)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    marginTop: 'var(--spacing-xs)'
                  }}>
                    {passwordsMatch ? (
                      <>
                        <i className="fas fa-check"></i>Passwords match
                      </>
                    ) : (
                      <>
                        <i className="fas fa-times"></i>Passwords don't match
                      </>
                    )}
                  </div>
                )}
              </div>

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
                style={{
                  width: '100%',
                  height: '48px',
                  fontSize: 'var(--text-base)',
                  fontWeight: '500',
                  background: loading ? 'var(--color-text-muted)' : 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
                  border: 'none'
                }}
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
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                    fontWeight: '500',
                    transition: 'color var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.target.style.color = 'var(--color-primary-dark)'}
                  onMouseOut={(e) => e.target.style.color = 'var(--color-primary)'}
                >
                  <i className="fas fa-sign-in-alt me-1"></i>Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: '120px',
          height: '120px',
          background: 'var(--color-accent)',
          borderRadius: '50%',
          opacity: 0.1,
          zIndex: -1,
          animation: 'float 7s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: '80px',
          height: '80px',
          background: 'var(--color-primary)',
          borderRadius: '50%',
          opacity: 0.1,
          zIndex: -1,
          animation: 'float 5s ease-in-out infinite reverse'
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

export default Signup;