import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial);

  //fetch a note
  const getNotes = async() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        }
      });
      
      const json = await response.json();
      
      // Check if the response is successful and contains an array
      if (response.ok && Array.isArray(json)) {
        setNotes(json);
      } else {
        console.error('Failed to fetch notes:', json);
        setNotes([]); // Ensure notes remains an array
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setNotes([]); // Ensure notes remains an array
    }
  }

  //Add a note
  const addNote = async(title, description, tag) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({title, description, tag}),
      });
      
      const note = await response.json();
      
      if (response.ok) {
        setNotes(prevNotes => prevNotes.concat(note));
      } else {
        console.error('Failed to add note:', note);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  //Delete a Note
  const deleteNote = async(id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        }
      });
      
      if (response.ok) {
        const newNotes = notes.filter((note) => {
          return note._id !== id;
        });
        setNotes(newNotes);
      } else {
        const json = await response.json();
        console.error('Failed to delete note:', json);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  //Update a note
  const editNote = async (id, title, description, tag) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token
        },
        body: JSON.stringify({title, description, tag}),
      });
      
      if (response.ok) {
        let newNotes = JSON.parse(JSON.stringify(notes))
        //logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if (element._id === id) {
            newNotes[index].title = title;
            newNotes[index].description = description;
            newNotes[index].tag = tag;
            break;
          }
        }
        setNotes(newNotes);
      } else {
        const json = await response.json();
        console.error('Failed to update note:', json);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;