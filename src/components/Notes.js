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

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote._id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag || ""
    });
  };

  const handleClick = () => {
    editNote(note.id, note.etitle, note.edescription, note.etag);
    refClose.current.click();
    props.showAlert("Note updated successfully", "success");
  };
  
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
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
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-search me-2"></i>Search & Filter
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {/* Search Input */}
            <div className="col-md-8">
              <label htmlFor="searchInput" className="form-label">
                <i className="fas fa-search me-1"></i>Search Notes
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="searchInput"
                  placeholder="Search by title, content, or tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm("")}
                    title="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Tag Filter */}
            <div className="col-md-4">
              <label htmlFor="tagFilter" className="form-label">
                <i className="fas fa-tag me-1"></i>Filter by Tag
              </label>
              <select
                className="form-select"
                id="tagFilter"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
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
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Active filters: </small>
                  {searchTerm && (
                    <span className="badge bg-primary me-1">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {selectedTag && (
                    <span className="badge bg-info me-1">
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
            </div>
          )}
        </div>
      </div>

      {/* Notes Statistics */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row text-center">
            <div className="col-md-3 col-sm-6 mb-2">
              <div className="stat-item">
                <i className="fas fa-sticky-note fa-2x text-primary mb-2"></i>
                <div className="h4 mb-0">{notes.length}</div>
                <div className="text-muted small">Total Notes</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-2">
              <div className="stat-item">
                <i className="fas fa-filter fa-2x text-info mb-2"></i>
                <div className="h4 mb-0">{filteredNotes.length}</div>
                <div className="text-muted small">Filtered Notes</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-2">
              <div className="stat-item">
                <i className="fas fa-tags fa-2x text-success mb-2"></i>
                <div className="h4 mb-0">{availableTags.length}</div>
                <div className="text-muted small">Unique Tags</div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-2">
              <div className="stat-item">
                <i className="fas fa-font fa-2x text-warning mb-2"></i>
                <div className="h4 mb-0">
                  {notes.reduce((total, note) => total + (note.description?.length || 0), 0)}
                </div>
                <div className="text-muted small">Total Characters</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Note Modal */}
      <button
        type="button"
        ref={ref}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#editNoteModal"
      >
        Launch demo modal
      </button>
      
      <div
        className="modal fade"
        id="editNoteModal"
        tabIndex="-1"
        aria-labelledby="editNoteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editNoteModalLabel">
                <i className="fas fa-edit me-2"></i>Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">
                    <i className="fas fa-heading me-2"></i>Title *
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
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">
                    <i className="fas fa-align-left me-2"></i>Description *
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
                  />
                  <div className="form-text">
                    Characters: {note.edescription.length}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">
                    <i className="fas fa-tag me-2"></i>Tag
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="etag"
                    name="etag"
                    value={note.etag}
                    onChange={onChange}
                    placeholder="Enter a tag"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                ref={refClose}
              >
                <i className="fas fa-times me-2"></i>Cancel
              </button>
              <button
                disabled={note.etitle.length < 5 || note.edescription.length < 5}
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
              >
                <i className="fas fa-save me-2"></i>Update Note
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Display */}
      <div className="row my-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1>
            <i className="fas fa-sticky-note me-2"></i>Your Notes
          </h1>
          <small className="text-muted">
            Showing {filteredNotes.length} of {notes.length} notes
          </small>
        </div>
        
        <div className="container mx-1">
          {filteredNotes.length === 0 && notes.length === 0 && (
            <div className="text-center py-5">
              <i className="fas fa-sticky-note fa-4x text-muted mb-3"></i>
              <h3 className="text-muted">No notes yet</h3>
              <p className="text-muted">Create your first note using the form above!</p>
            </div>
          )}
          {filteredNotes.length === 0 && notes.length > 0 && (
            <div className="text-center py-5">
              <i className="fas fa-search fa-4x text-muted mb-3"></i>
              <h3 className="text-muted">No notes match your search</h3>
              <p className="text-muted">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
        
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

      <style jsx>{`
        .stat-item {
          padding: 10px;
          border-radius: 8px;
          transition: transform 0.2s;
        }
        .stat-item:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
};

export default Notes;