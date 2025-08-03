import React from "react";

const About = () => {
  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      background: 'linear-gradient(135deg, var(--color-background) 0%, var(--color-primary-light) 100%)',
      padding: 'var(--spacing-xl) 0'
    }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--spacing-2xl)',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          <div style={{
            fontSize: '4rem',
            color: 'var(--color-primary)',
            marginBottom: 'var(--spacing-lg)',
            opacity: 0.9
          }}>
            <i className="fas fa-sticky-note"></i>
          </div>
          <h1 style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: '700',
            color: 'var(--color-text)',
            marginBottom: 'var(--spacing-md)',
            fontFamily: 'var(--font-secondary)'
          }}>
            About Diary Desk
          </h1>
          <p style={{
            fontSize: 'var(--text-xl)',
            color: 'var(--color-text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
            fontWeight: '300'
          }}>
            Your personal, secure, and beautifully designed digital sanctuary for thoughts, ideas, and memories.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="card" style={{
          maxWidth: '1000px',
          margin: '0 auto',
          border: 'none',
          boxShadow: 'var(--shadow-xl)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          animation: 'scaleIn 0.6s ease-out'
        }}>
          {/* Features Section */}
          <div className="card-body" style={{ padding: 'var(--spacing-2xl)' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              <h2 style={{
                fontSize: 'var(--text-3xl)',
                fontWeight: '600',
                color: 'var(--color-text)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Powerful Features for Modern Note-Taking
              </h2>
              <p style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-secondary)',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                Everything you need to capture, organize, and revisit your thoughts with ease.
              </p>
            </div>

            {/* Features Grid */}
            <div className="row" style={{ marginBottom: 'var(--spacing-2xl)' }}>
              {[
                {
                  icon: 'fas fa-plus-circle',
                  title: 'Create & Edit',
                  description: 'Effortlessly create and edit notes with our intuitive interface',
                  color: 'var(--color-primary)'
                },
                {
                  icon: 'fas fa-search',
                  title: 'Smart Search',
                  description: 'Find any note instantly with powerful search functionality',
                  color: 'var(--color-accent)'
                },
                {
                  icon: 'fas fa-tags',
                  title: 'Tag System',
                  description: 'Organize notes with customizable tags and categories',
                  color: 'var(--color-success)'
                },
                {
                  icon: 'fas fa-moon',
                  title: 'Dark Mode',
                  description: 'Switch between light and dark themes for comfortable viewing',
                  color: 'var(--color-warning)'
                },
                {
                  icon: 'fas fa-mobile-alt',
                  title: 'Responsive Design',
                  description: 'Perfect experience across all devices and screen sizes',
                  color: 'var(--color-info)'
                },
                {
                  icon: 'fas fa-shield-alt',
                  title: 'Secure Storage',
                  description: 'Your notes are protected with industry-standard security',
                  color: 'var(--color-error)'
                }
              ].map((feature, index) => (
                <div key={index} className="col-12 col-md-6" style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-lg)',
                    transition: 'all var(--transition-normal)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-background)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: feature.color,
                      color: 'var(--color-white)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--text-xl)',
                      flexShrink: 0
                    }}>
                      <i className={feature.icon}></i>
                    </div>
                    <div>
                      <h4 style={{
                        fontSize: 'var(--text-lg)',
                        fontWeight: '600',
                        color: 'var(--color-text)',
                        marginBottom: 'var(--spacing-xs)'
                      }}>
                        {feature.title}
                      </h4>
                      <p style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-text-secondary)',
                        margin: 0,
                        lineHeight: '1.5'
                      }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Technology Stack */}
            <div style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-2xl)',
              padding: 'var(--spacing-xl)',
              backgroundColor: 'var(--color-background)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <h3 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: '600',
                color: 'var(--color-text)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                Built with Modern Technologies
              </h3>
              
              <div className="row">
                <div className="col-12 col-md-6" style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <h5 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      color: 'var(--color-primary)',
                      marginBottom: 'var(--spacing-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--spacing-sm)'
                    }}>
                      <i className="fab fa-react"></i>Frontend
                    </h5>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-sm)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      <div>• React.js 18 - Modern UI library</div>
                      <div>• Custom CSS - Beautiful styling</div>
                      <div>• Font Awesome - Rich iconography</div>
                      <div>• React Router - Smooth navigation</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-12 col-md-6" style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <h5 style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: '600',
                      color: 'var(--color-success)',
                      marginBottom: 'var(--spacing-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 'var(--spacing-sm)'
                    }}>
                      <i className="fas fa-server"></i>Backend
                    </h5>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-sm)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)'
                    }}>
                      <div>• Node.js - Server runtime</div>
                      <div>• Express.js - Web framework</div>
                      <div>• MongoDB - Document database</div>
                      <div>• JWT - Secure authentication</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
              color: 'var(--color-white)',
              padding: 'var(--spacing-2xl)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              <h3 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)'
              }}>
                <i className="fas fa-shield-alt"></i>
                Security & Privacy First
              </h3>
              
              <div className="row">
                {[
                  {
                    icon: 'fas fa-key',
                    title: 'JWT Authentication',
                    description: 'Secure token-based authentication system'
                  },
                  {
                    icon: 'fas fa-lock',
                    title: 'Password Protection',
                    description: 'Bcrypt encryption for password security'
                  },
                  {
                    icon: 'fas fa-user-shield',
                    title: 'Data Privacy',
                    description: 'Your notes are private and secure'
                  },
                  {
                    icon: 'fas fa-check-circle',
                    title: 'Input Validation',
                    description: 'Comprehensive data validation and sanitization'
                  }
                ].map((item, index) => (
                  <div key={index} className="col-12 col-md-6" style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      textAlign: 'left'
                    }}>
                      <i className={item.icon} style={{ fontSize: 'var(--text-xl)', opacity: 0.9 }}></i>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9 }}>
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            <div style={{
              backgroundColor: 'var(--color-background)',
              padding: 'var(--spacing-xl)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--spacing-2xl)'
            }}>
              <h3 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: '600',
                color: 'var(--color-text)',
                marginBottom: 'var(--spacing-lg)',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)'
              }}>
                <i className="fas fa-lightbulb" style={{ color: 'var(--color-warning)' }}></i>
                Tips for Better Note-Taking
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--spacing-md)'
              }}>
                {[
                  'Use descriptive titles to find your notes easily',
                  'Add tags to organize your notes by topic or project',
                  'Use the search function to quickly locate specific content',
                  'Keep your notes concise but detailed enough for future reference',
                  'Regularly review and update your notes to keep them current',
                  'Take advantage of dark mode for comfortable night reading'
                ].map((tip, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-sm)',
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <i className="fas fa-check" style={{
                      color: 'var(--color-success)',
                      marginTop: '2px',
                      flexShrink: 0
                    }}></i>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.5'
                    }}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div style={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--color-success) 0%, var(--color-accent) 100%)',
              color: 'var(--color-white)',
              padding: 'var(--spacing-2xl)',
              borderRadius: 'var(--radius-lg)'
            }}>
              <h3 style={{
                fontSize: 'var(--text-2xl)',
                fontWeight: '600',
                marginBottom: 'var(--spacing-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-sm)'
              }}>
                <i className="fas fa-rocket"></i>
                Ready to Get Started?
              </h3>
              <p style={{
                fontSize: 'var(--text-lg)',
                marginBottom: 'var(--spacing-xl)',
                opacity: 0.9,
                maxWidth: '500px',
                margin: '0 auto var(--spacing-xl) auto'
              }}>
                Begin your digital journaling journey today. Capture your thoughts, organize your ideas, and never lose track of what matters.
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--spacing-xl)',
                flexWrap: 'wrap'
              }}>
                {[
                  { icon: 'fas fa-plus-circle', text: 'Create your first note' },
                  { icon: 'fas fa-tags', text: 'Add tags to organize' },
                  { icon: 'fas fa-search', text: 'Search and filter easily' }
                ].map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    minWidth: '150px'
                  }}>
                    <i className={item.icon} style={{
                      fontSize: '2.5rem',
                      opacity: 0.9,
                      marginBottom: 'var(--spacing-sm)'
                    }}></i>
                    <span style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div style={{
          textAlign: 'center',
          marginTop: 'var(--spacing-2xl)',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-sm)'
        }}>
          <p style={{ margin: 0 }}>
            Diary Desk v1.0 - Built with ❤️ for better note-taking
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;