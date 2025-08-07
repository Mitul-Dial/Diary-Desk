import NoteContext from "./noteContext";
import { useState, useEffect } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const isAuthenticated = () => {
    const token = getAuthToken();
    return !!token;
  };

  const getNotes = async () => {
    if (!isAuthenticated()) {
      setNotes([]);
      return;
    }

    setIsLoading(true);
    try {
      const token = getAuthToken();
      
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": token
        }
      });


      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          setNotes([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      
      if (Array.isArray(json)) {
        setNotes(json);
      } else if (json && json.notes && Array.isArray(json.notes)) {
        setNotes(json.notes);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (props.isAuthenticated) {
      getNotes();
    } else {
      setNotes([]);
    }
  }, [props.isAuthenticated]);

  // Add a Note
  const addNote = async (title, description, tag) => {
    if (!isAuthenticated()) {
      return false;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": token
        },
        body: JSON.stringify({ title, description, tag })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.note && result.note._id) {
        setNotes(prevNotes => {
          const currentNotes = Array.isArray(prevNotes) ? prevNotes : [];
          return [result.note, ...currentNotes];
        });
        return true;
      } 
      else if (result._id) {
        setNotes(prevNotes => {
          const currentNotes = Array.isArray(prevNotes) ? prevNotes : [];
          return [result, ...currentNotes];
        });
        return true;
      } 
      else {
        return false;
      }
    } catch (error) {
      console.error("Error adding note:", error);
      return false;
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    if (!isAuthenticated()) {
      return false;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": token
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNotes(prevNotes => {
        const currentNotes = Array.isArray(prevNotes) ? prevNotes : [];
        return currentNotes.filter((note) => note._id !== id);
      });
      return true;
    } catch (error) {
      console.error("Error deleting note:", error);
      return false;
    }
  };

  const editNote = async (id, title, description, tag) => {
    if (!isAuthenticated()) {
      return false;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "auth-token": token
        },
        body: JSON.stringify({ title, description, tag })
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      setNotes(prevNotes => {
        const currentNotes = Array.isArray(prevNotes) ? prevNotes : [];
        return currentNotes.map(note => {
          if (note._id === id) {
            return {
              ...note,
              title: title,
              description: description,
              tag: tag
            };
          }
          return note;
        });
      });
      return true;
    } catch (error) {
      console.error("Error editing note:", error);
      return false;
    }
  };

  return (
    <NoteContext.Provider value={{ 
      notes, 
      addNote, 
      deleteNote, 
      editNote, 
      getNotes,
      isLoading,
      isAuthenticated: props.isAuthenticated
    }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;