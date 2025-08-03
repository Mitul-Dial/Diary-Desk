import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";

const Noteitem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note, updateNote } = props;
  const [showFullContent, setShowFullContent] = useState(false);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(note._id);
      props.showAlert("Note deleted successfully", "success");
    }
  };

  // Truncate content for preview
  const truncateText = (text, limit = 150) => {
    if (!text) return '';
    if (text.length <= limit) return text;
    return showFullContent ? text : text.substring(0, limit) + '...';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  return (
    <div className="col-lg-4 col-md-6 col-sm-12">
      <div className="card my-3 h-100 note-card">
        <div className="card-header d-flex justify-content-between align-items-start">
          <h5 className="card-title mb-0 flex-grow-1" title={note.title}>
            {note.title.length > 30 ? note.title.substring(0, 30) + '...' : note.title}
          </h5>
          
          {/* Action Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-link btn-sm text-muted p-1"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item" onClick={() => updateNote(note)}>
                  <i className="fas fa-edit me-2"></i>Edit
                </button>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleDelete}>
                  <i className="fas fa-trash me-2"></i>Delete
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="card-body d-flex flex-column">
          {/* Note Content */}
          <div className="note-content mb-3 flex-grow-1">
            <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>
              {truncateText(note.description, 150)}
            </p>
            {note.description && note.description.length > 150 && (
              <button
                className="btn btn-link btn-sm p-0 mt-1"
                onClick={() => setShowFullContent(!showFullContent)}
              >
                <i className={`fas ${showFullContent ? 'fa-chevron-up' : 'fa-chevron-down'} me-1`}></i>
                {showFullContent ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Tag */}
          {note.tag && (
            <div className="mb-3">
              <span className="badge bg-primary">
                <i className="fas fa-tag me-1"></i>{note.tag}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="card-footer bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              <i className="fas fa-calendar-plus me-1"></i>
              {formatDate(note.date)}
            </div>
            
            {/* Quick Actions */}
            <div className="btn-group btn-group-sm" role="group">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => updateNote(note)}
                title="Edit Note"
              >
                <i className="fas fa-edit"></i>
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleDelete}
                title="Delete Note"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .note-card {
          transition: transform 0.2s, box-shadow 0.2s;
          border: 1px solid #dee2e6;
        }
        .note-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .note-content {
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
        .card-title {
          overflow-wrap: break-word;
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default Noteitem;