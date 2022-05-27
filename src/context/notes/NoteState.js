import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);
  // get all note Notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIyNWJhZmZjZDM0NzZjY2NiNTYxNjc3In0sImlhdCI6MTY0NjYzOTg4Nn0.6A5BooZpG3yqVbIDdba5YPCG2vxUDaER1Wqq0zknN0w",
      }
    });
    const json = await response.json();
    setNotes(json.notes);
  };
  
  // add Notes
  const addNote = async (title, description, tag) => {
    // TODO API call;
    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIyNWJhZmZjZDM0NzZjY2NiNTYxNjc3In0sImlhdCI6MTY0NjYzOTg4Nn0.6A5BooZpG3yqVbIDdba5YPCG2vxUDaER1Wqq0zknN0w",
      },
      body: JSON.stringify({ title, description, tag }),
    });

    const note = await response.json();

   
    setNotes(notes.concat(note));
        
  };

  // delete Notes
  const deleteNote = async (id) => {

    // TODO API call;
    const response = await fetch(`${host}/api/notes//deletenotes/${id}`, {
      method: "DELETE", 
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIyNWJhZmZjZDM0NzZjY2NiNTYxNjc3In0sImlhdCI6MTY0NjYzOTg4Nn0.6A5BooZpG3yqVbIDdba5YPCG2vxUDaER1Wqq0zknN0w",
      },
    });

    const json = await response.json();
    console.log(json);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });

    setNotes(newNotes);
    console.log("Deleting note with id" + id);
  };

  //  Edit Notes
  const editNote = async (id, title, description, tag) => {

    // API call
    const response = await fetch(`${host}/api/notes//updatenotes/${id}`, {
      method: "PUT", 

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjIyNWJhZmZjZDM0NzZjY2NiNTYxNjc3In0sImlhdCI6MTY0NjYzOTg4Nn0.6A5BooZpG3yqVbIDdba5YPCG2vxUDaER1Wqq0zknN0w",
      },
      body: JSON.stringify({ title, description, tag }),
    });

    let newNotes = JSON.parse(JSON.stringify(notes));
    // logic to edit client
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
  };
  return (
    <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes}}>
      {props.children}
    </NoteContext.Provider>
  );
};
export default NoteState;
