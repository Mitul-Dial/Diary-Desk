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
    <div className="container my-4">
      <div className="card">
        <div className="card-header">
          <h2 className="mb-0">
            <i className="fas fa-plus-circle me-2"></i>Add a Note
          </h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleClick}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                <i className="fas fa-heading me-2"></i>Title *
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
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                <i className="fas fa-align-left me-2"></i>Description *
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                onChange={onChange}
                rows="6"
                minLength={5}
                required
                value={note.description}
                placeholder="Enter your note content here (minimum 5 characters)..."
              />
              <div className="form-text">
                Characters: {note.description.length}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="tag" className="form-label">
                <i className="fas fa-tag me-2"></i>Tag
              </label>
              <input
                type="text"
                className="form-control"
                id="tag"
                name="tag"
                value={note.tag}
                onChange={onChange}
                placeholder="Enter a tag (optional)"
              />
              <div className="form-text">
                Add a single tag to categorize your note
              </div>
            </div>

            <div className="d-grid">
              <button
                disabled={note.title.length < 5 || note.description.length < 5}
                type="submit"
                className="btn btn-primary btn-lg"
              >
                <i className="fas fa-save me-2"></i>Add Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNote;