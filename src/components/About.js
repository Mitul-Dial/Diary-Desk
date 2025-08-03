import React from "react";

const About = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h1 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>About Diary Desk
              </h1>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <h3>Welcome to Diary Desk</h3>
                  <p className="lead">
                    Your personal, secure, and user-friendly note-taking application built with modern web technologies.
                  </p>
                  
                  <h4>Features</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          <strong>Create Notes:</strong> Add notes with title, description, and tags
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          <strong>Edit Notes:</strong> Update your notes anytime
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          <strong>Delete Notes:</strong> Remove notes you no longer need
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          <strong>Search Function:</strong> Find notes quickly
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          <strong>Tag System:</strong> Organize notes with tags
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          <strong>Filter by Tags:</strong> View notes by category
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          <strong>Dark Mode:</strong> Easy on the eyes
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-check text-success me-2"></i>
                          <strong>Responsive Design:</strong> Works on all devices
                        </li>
                      </ul>
                    </div>
                  </div>

                  <h4 className="mt-4">Technology Stack</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <h6><i className="fab fa-react me-2"></i>Frontend</h6>
                      <ul>
                        <li>React.js 18</li>
                        <li>Bootstrap 5</li>
                        <li>Font Awesome Icons</li>
                        <li>React Router DOM</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6><i className="fas fa-server me-2"></i>Backend</h6>
                      <ul>
                        <li>Node.js</li>
                        <li>Express.js</li>
                        <li>MongoDB</li>
                        <li>JWT Authentication</li>
                      </ul>
                    </div>
                  </div>

                  <h4 className="mt-4">Security</h4>
                  <p>
                    Your notes are protected with industry-standard security measures:
                  </p>
                  <ul>
                    <li><i className="fas fa-shield-alt text-success me-2"></i>JWT (JSON Web Token) authentication</li>
                    <li><i className="fas fa-shield-alt text-success me-2"></i>Secure password hashing with bcrypt</li>
                    <li><i className="fas fa-shield-alt text-success me-2"></i>Protected API routes</li>
                    <li><i className="fas fa-shield-alt text-success me-2"></i>Input validation and sanitization</li>
                  </ul>
                </div>

                <div className="col-md-4">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <i className="fas fa-sticky-note fa-5x text-primary mb-3"></i>
                      <h5>Version 1.0</h5>
                      <p className="text-muted">Simple and Effective</p>
                      
                      <div className="mt-4">
                        <h6>Quick Features</h6>
                        <div className="row text-center">
                          <div className="col-6">
                            <div className="border-end">
                              <strong>Simple</strong>
                              <div className="small text-muted">Interface</div>
                            </div>
                          </div>
                          <div className="col-6">
                            <strong>Secure</strong>
                            <div className="small text-muted">Storage</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card mt-3">
                    <div className="card-header">
                      <h6 className="mb-0">
                        <i className="fas fa-keyboard me-2"></i>Keyboard Shortcuts
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="small">
                        <div className="d-flex justify-content-between mb-2">
                          <span>Create Note</span>
                          <span className="text-muted">Fill form & submit</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Edit Note</span>
                          <span className="text-muted">Click edit button</span>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <span>Search</span>
                          <span className="text-muted">Use search box</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Filter</span>
                          <span className="text-muted">Select tag dropdown</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <div className="alert alert-info">
                    <h5><i className="fas fa-lightbulb me-2"></i>Tips for Better Note-Taking</h5>
                    <ul className="mb-0">
                      <li>Use descriptive titles to find your notes easily</li>
                      <li>Add tags to organize your notes by topic or project</li>
                      <li>Use the search function to quickly locate specific content</li>
                      <li>Keep your notes concise but detailed enough for future reference</li>
                      <li>Regularly review and update your notes to keep them current</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center">
                      <h5><i className="fas fa-rocket me-2"></i>Get Started</h5>
                      <p className="mb-3">Ready to organize your thoughts and ideas?</p>
                      <div className="d-flex justify-content-center gap-3">
                        <div className="text-center">
                          <i className="fas fa-plus-circle fa-2x mb-2"></i>
                          <div className="small">Create your first note</div>
                        </div>
                        <div className="text-center">
                          <i className="fas fa-tags fa-2x mb-2"></i>
                          <div className="small">Add tags to organize</div>
                        </div>
                        <div className="text-center">
                          <i className="fas fa-search fa-2x mb-2"></i>
                          <div className="small">Search and filter easily</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;