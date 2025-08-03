import React, { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import { useNavigate } from "react-router-dom";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";

const Notes = (props) => {
  const context = useContext(noteContext);
  let navigate = useNavigate();
  const { notes, getNotes, editNote } = context;
  
  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes();
    }
    else{
      navigate("/login")
    }
    // eslint-disable-next-line
  }, []);
  
  const ref = useRef(null);
  const refClose = useRef(null);
  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: ""
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const updateNote = (currentNote) => {
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag || ""
    });
    setModalOpen(true);
  };

  const handleClick = () => {
    editNote(note.id, note.etitle, note.edescription, note.etag);
    setModalOpen(false);
    props.showAlert("Note updated successfully", "success");
  };
  
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Get unique tags from notes
  const getAllTags = () => {
    const tags = new Set();
    notes.forEach(note => {
      if (note.tag && note.tag.trim()) {
        tags.add(note.tag.trim());
      }
    });
    return Array.from(tags).sort();
  };

  // Filter notes based on search and tag
  const getFilteredNotes = () => {
    return notes.filter(note => {
      const matchesSearch = !searchTerm || 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.tag && note.tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTag = !selectedTag || note.tag === selectedTag;
      
      return matchesSearch && matchesTag;
    });
  };

  const filteredNotes = getFilteredNotes();
  const availableTags = getAllTags();

  return (
    <>
      <AddNote showAlert={props.showAlert} />
      
      {/* Search and Filter Section */}
      <div className="container" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card" style={{
          border: 'none',
          boxShadow: 'var(--shadow-md)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div className="card-header" style={{
            background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
            color: 'var(--color-white)'
          }}>
            <h5 style={{
              margin: 0,
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <i className="fas fa-search"></i>
              Search & Filter
            </h5>
          </div>
          
          <div className="card-body" style={{ padding: 'var(--spacing-lg)' }}>
            <div className="row" style={{ gap: 'var(--spacing-md)' }}>
              {/* Search Input */}
              <div className="col-12 col-md-8" style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-sm)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: 'var(--color-text)'
                }}>
                  <i className="fas fa-search me-1" style={{ color: 'var(--color-primary)' }}></i>
                  Search Notes
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by title, content, or tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      height: '48px',
                      paddingRight: searchTerm ? '48px' : 'var(--spacing-md)',
                      fontSize: 'var(--text-base)'
                    }}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      title="Clear search"
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-text-muted)',
                        color: 'var(--color-white)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--text-xs)'
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Tag Filter */}
              <div className="col-12 col-md-4" style={{ marginBottom: 'var(--spacing-md)' }}>
                <label style={{
                  display: 'block',
                  marginBottom: 'var(--spacing-sm)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: 'var(--color-text)'
                }}>
                  <i className="fas fa-tag me-1" style={{ color: 'var(--color-primary)' }}></i>
                  Filter by Tag
                </label>
                <select
                  className="form-select"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  style={{
                    height: '48px',
                    fontSize: 'var(--text-base)'
                  }}
                >
                  <option value="">All Tags</option>
                  {availableTags.map((tag, index) => (
                    <option key={index} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || selectedTag) && (
              <div style={{
                marginTop: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-background)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--spacing-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    Active filters:
                  </span>
                  {searchTerm && (
                    <span className="badge" style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-white)'
                    }}>
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {selectedTag && (
                    <span className="badge" style={{
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-white)'
                    }}>
                      Tag: {selectedTag}
                    </span>
                  )}
                </div>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedTag("");
                  }}
                >
                  <i className="fas fa-times me-1"></i>Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes Statistics */}
      <div className="container" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card" style={{
          border: 'none',
          boxShadow: 'var(--shadow-sm)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <div className="card-body" style={{ padding: 'var(--spacing-lg)' }}>
            <div className="row" style={{ textAlign: 'center' }}>
              <div className="col-6 col-md-3" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-background)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  <i className="fas fa-sticky-note" style={{
                    fontSize: '2rem',
                    color: 'var(--color-primary)',
                    marginBottom: 'var(--spacing-sm)'
                  }}></i>
                  <div style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: '700',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {notes.length}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-muted)'
                  }}>
                    Total Notes
                  </div>
                </div>
              </div>
              
              <div className="col-6 col-md-3" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-background)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  <i className="fas fa-filter" style={{
                    fontSize: '2rem',
                    color: 'var(--color-accent)',
                    marginBottom: 'var(--spacing-sm)'
                  }}></i>
                  <div style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: '700',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {filteredNotes.length}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-muted)'
                  }}>
                    Filtered Notes
                  </div>
                </div>
              </div>
              
              <div className="col-6 col-md-3" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-background)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  <i className="fas fa-tags" style={{
                    fontSize: '2rem',
                    color: 'var(--color-success)',
                    marginBottom: 'var(--spacing-sm)'
                  }}></i>
                  <div style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: '700',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {availableTags.length}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-muted)'
                  }}>
                    Unique Tags
                  </div>
                </div>
              </div>
              
              <div className="col-6 col-md-3" style={{ marginBottom: 'var(--spacing-md)' }}>
                <div style={{
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--color-background)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  <i className="fas fa-font" style={{
                    fontSize: '2rem',
                    color: 'var(--color-warning)',
                    marginBottom: 'var(--spacing-sm)'
                  }}></i>
                  <div style={{
                    fontSize: 'var(--text-2xl)',
                    fontWeight: '700',
                    color: 'var(--color-text)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {notes.reduce((total, note) => total + (note.description?.length || 0), 0).toLocaleString()}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--color-text-muted)'
                  }}>
                    Total Characters
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Note Modal */}
      {modalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-edit me-2"></i>Edit Note
                </h5>
                <button
                  className="btn-close"
                  onClick={closeModal}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="etitle" className="form-label">
                      <i className="fas fa-heading me-2" style={{color: 'var(--color-primary)'}}></i>
                      Title *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="etitle"
                      name="etitle"
                      value={note.etitle}
                      onChange={onChange}
                      minLength={5}
                      required
                      style={{ height: '48px' }}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="edescription" className="form-label">
                      <i className="fas fa-align-left me-2" style={{color: 'var(--color-primary)'}}></i>
                      Content *
                    </label>
                    <textarea
                      className="form-control"
                      id="edescription"
                      name="edescription"
                      value={note.edescription}
                      onChange={onChange}
                      rows="6"
                      minLength={5}
                      required
                      style={{ resize: 'vertical' }}
                    />
                    <div className="form-text">
                      Characters: {note.edescription.length}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="etag" className="form-label">
                      <i className="fas fa-tag me-2" style={{color: 'var(--color-primary)'}}></i>
                      Category Tag
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="etag"
                      name="etag"
                      value={note.etag}
                      onChange={onChange}
                      placeholder="Enter a tag"
                      style={{ height: '48px' }}
                    />
                  </div>
                </form>
              </div>
              
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  <i className="fas fa-times me-2"></i>Cancel
                </button>
                <button
                  disabled={note.etitle.length < 5 || note.edescription.length < 5}
                  className="btn btn-primary"
                  onClick={handleClick}
                >
                  <i className="fas fa-save me-2"></i>Update Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Display */}
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xl)'
        }}>
          <h1 style={{
            fontSize: 'var(--text-3xl)',
            fontWeight: '700',
            color: 'var(--color-text)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            <i className="fas fa-sticky-note" style={{ color: 'var(--color-primary)' }}></i>
            Your Notes
          </h1>
          <div style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
            textAlign: 'right'
          }}>
            Showing {filteredNotes.length} of {notes.length} notes
          </div>
        </div>
        
        {/* Empty States */}
        {filteredNotes.length === 0 && notes.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            color: 'var(--color-text-muted)'
          }}>
            <i className="fas fa-sticky-note" style={{
              fontSize: '4rem',
              marginBottom: 'var(--spacing-lg)',
              opacity: 0.5
            }}></i>
            <h3 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-text-secondary)'
            }}>
              No notes yet
            </h3>
            <p style={{
              fontSize: 'var(--text-base)',
              margin: 0,
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6'
            }}>
              Start your journey by creating your first note. Capture your thoughts, ideas, and memories in your personal digital diary.
            </p>
          </div>
        )}
        
        {filteredNotes.length === 0 && notes.length > 0 && (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            color: 'var(--color-text-muted)'
          }}>
            <i className="fas fa-search" style={{
              fontSize: '4rem',
              marginBottom: 'var(--spacing-lg)',
              opacity: 0.5
            }}></i>
            <h3 style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              marginBottom: 'var(--spacing-md)',
              color: 'var(--color-text-secondary)'
            }}>
              No notes match your search
            </h3>
            <p style={{
              fontSize: 'var(--text-base)',
              margin: 0,
              maxWidth: '400px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: '1.6'
            }}>
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
        
        {/* Notes Grid */}
        {filteredNotes.length > 0 && (
          <div className="row" style={{ margin: '0 calc(-1 * var(--spacing-sm))' }}>
            {filteredNotes.map((note) => {
              return (
                <Noteitem
                  key={note._id}
                  updateNote={updateNote}
                  note={note}
                  showAlert={props.showAlert}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Notes;