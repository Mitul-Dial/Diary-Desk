import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const [note, setNote] = useState({ 
    title: "", 
    description: "", 
    tag: ""
  });

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const success = await addNote(note.title, note.description, note.tag);
      
      if (success !== false) {
        setNote({ title: "", description: "", tag: "" });
        props.showAlert("Note added successfully", "success");
      } else {
        props.showAlert("Failed to add note", "danger");
      }
    } catch (error) {
      console.error('Error in handleClick:', error);
      props.showAlert("Failed to add note", "danger");
    }
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className="container" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-lg)' }}>
      <div className="card" style={{
        maxWidth: '800px',
        margin: '0 auto',
        border: 'none',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div className="card-header" style={{
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          color: 'var(--color-white)',
          textAlign: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 'var(--text-2xl)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            <i className="fas fa-plus-circle"></i>
            Create New Note
          </h2>
          <p style={{
            margin: 'var(--spacing-sm) 0 0 0',
            opacity: 0.9,
            fontSize: 'var(--text-sm)'
          }}>
            Capture your thoughts and ideas
          </p>
        </div>
        
        <div className="card-body" style={{ padding: 'var(--spacing-xl)' }}>
          <form onSubmit={handleClick}>
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                <i className="fas fa-heading me-2" style={{color: 'var(--color-primary)'}}></i>
                Title *
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                onChange={onChange}
                minLength={5}
                required
                value={note.title}
                placeholder="Enter note title (minimum 5 characters)..."
                style={{
                  height: '48px',
                  fontSize: 'var(--text-base)',
                  fontWeight: '500'
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                <i className="fas fa-align-left me-2" style={{color: 'var(--color-primary)'}}></i>
                Content *
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                onChange={onChange}
                rows="8"
                minLength={5}
                required
                value={note.description}
                placeholder="Write your note content here... Share your thoughts, ideas, or anything you want to remember."
                style={{
                  fontSize: 'var(--text-base)',
                  lineHeight: '1.6',
                  resize: 'vertical',
                  minHeight: '200px'
                }}
              />
              <div className="form-text" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>
                  <i className="fas fa-info-circle me-1"></i>
                  Minimum 5 characters required
                </span>
                <span style={{
                  color: note.description.length >= 5 ? 'var(--color-success)' : 'var(--color-text-muted)',
                  fontWeight: '500'
                }}>
                  {note.description.length} characters
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="tag" className="form-label">
                <i className="fas fa-tag me-2" style={{color: 'var(--color-primary)'}}></i>
                Category Tag
              </label>
              <input
                type="text"
                className="form-control"
                id="tag"
                name="tag"
                value={note.tag}
                onChange={onChange}
                placeholder="e.g., personal, work, ideas, journal..."
                style={{
                  height: '48px',
                  fontSize: 'var(--text-base)'
                }}
              />
              <div className="form-text">
                <i className="fas fa-lightbulb me-1"></i>
                Add a tag to organize and categorize your note
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: 'var(--spacing-xl)'
            }}>
              <button
                disabled={note.title.length < 5 || note.description.length < 5}
                type="submit"
                className="btn btn-primary btn-lg"
                style={{
                  minWidth: '200px',
                  height: '52px',
                  fontSize: 'var(--text-lg)',
                  fontWeight: '600',
                  background: (note.title.length < 5 || note.description.length < 5) 
                    ? 'var(--color-text-muted)' 
                    : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                  border: 'none',
                  boxShadow: (note.title.length < 5 || note.description.length < 5) 
                    ? 'none' 
                    : 'var(--shadow-md)',
                  transition: 'all var(--transition-normal)'
                }}
              >
                <i className="fas fa-save me-2"></i>
                Save Note
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Inspirational Quote Section */}
      <div style={{
        textAlign: 'center',
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-lg)',
        color: 'var(--color-text-secondary)'
      }}>
        <p style={{
          fontSize: 'var(--text-lg)',
          fontStyle: 'italic',
          margin: 0,
          fontFamily: 'var(--font-secondary)'
        }}>
          "The pen is mightier than the sword."
        </p>
        <p style={{
          fontSize: 'var(--text-sm)',
          margin: 'var(--spacing-sm) 0 0 0',
          opacity: 0.8
        }}>
          — Edward Bulwer-Lytton
        </p>
      </div>
    </div>
  );
};

export default AddNote;