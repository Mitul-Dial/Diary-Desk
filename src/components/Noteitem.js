import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const Noteitem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;
  const [showFullContent, setShowFullContent] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(note._id);
      props.showAlert("Note deleted successfully", "success");
    }
    setDropdownOpen(false);
  };
  const truncateText = (text, limit = 150) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return showFullContent ? text : text.substring(0, limit) + '...';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="col-12 col-md-6 col-lg-4" style={{ marginBottom: 'var(--spacing-lg)' }}>
      <div 
        className="card"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all var(--transition-normal)',
          cursor: 'pointer',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        }}
      >
        <div className="card-header" style={{
          padding: 'var(--spacing-md)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          minHeight: '60px'
        }}>
          <h5 style={{
            margin: 0,
            fontSize: 'var(--text-lg)',
            fontWeight: '600',
            color: 'var(--color-text)',
            lineHeight: '1.4',
            flex: 1,
            marginRight: 'var(--spacing-sm)',
            wordBreak: 'break-word'
          }}>
            {note.title.length > 50 ? note.title.substring(0, 50) + '...' : note.title}
          </h5>
          
          <div className="dropdown" style={{ position: 'relative' }}>
            <button
              onClick={toggleDropdown}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-background)';
                e.target.style.color = 'var(--color-text)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--color-text-muted)';
              }}
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            
            {dropdownOpen && (
              <div className="dropdown-menu" style={{ display: 'block' }}>
                <button 
                  className="dropdown-item" 
                  onClick={() => {
                    updateNote(note);
                    setDropdownOpen(false);
                  }}
                >
                  <i className="fas fa-edit"></i>Edit
                </button>
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-item" 
                  onClick={handleDelete}
                  style={{ color: 'var(--color-error)' }}
                >
                  <i className="fas fa-trash"></i>Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card-body" style={{
          padding: 'var(--spacing-md)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ flex: 1, marginBottom: 'var(--spacing-md)' }}>
            <p style={{
              margin: 0,
              color: 'var(--color-text-secondary)',
              lineHeight: '1.6',
              fontSize: 'var(--text-sm)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {truncateText(note.description, 120)}
            </p>
            {note.description && note.description.length > 120 && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-xs)',
                  marginTop: 'var(--spacing-xs)',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}
              >
                <i className={`fas ${showFullContent ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                {showFullContent ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {note.tag && (
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <span className="badge" style={{
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-text)',
                fontSize: 'var(--text-xs)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '500'
              }}>
                <i className="fas fa-tag" style={{ marginRight: 'var(--spacing-xs)' }}></i>
                {note.tag}
              </span>
            </div>
          )}
        </div>

        <div className="card-footer" style={{
          padding: 'var(--spacing-md)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-background)'
        }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <i className="fas fa-calendar-alt"></i>
            {formatDate(note.date)}
          </div>
          
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-xs)'
          }}>
            <button
              onClick={() => updateNote(note)}
              title="Edit Note"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-primary)',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-primary)';
                e.target.style.color = 'var(--color-white)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--color-primary)';
              }}
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={handleDelete}
              title="Delete Note"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'transparent',
                border: '1px solid var(--color-error)',
                color: 'var(--color-error)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xs)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--color-error)';
                e.target.style.color = 'var(--color-white)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--color-error)';
              }}
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;