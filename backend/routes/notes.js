const express = require("express");
const router = express.Router();
const Notes = require("../Models/Note");
const fetchUser = require("../middleware/fetchuser");
const { body, validationResult, check } = require("express-validator");
const { json } = require("express");

// ROUTES 1: Get All the notes using GET method: /api/notes/fetchallnotes, login require
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json({ notes });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTES 2: Add new Notes using post mothod: /api/notes/fetchallnotes, login require
router.post(
  "/addnotes",
  fetchUser,
  [
    body("title", "Enter the valid title").isLength({ min: 3 }),
    body("description", "description should be atleast 5 charector").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      //  here we are destructuring fetching the  details from data base;
      const { title, description, tag } = req.body;

      //  if threr are errors return bad error and messaeg.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // we are creating the new note for the new user.
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      // saving the notes into the database;
      const saveNotes = await note.save();
      res.json(saveNotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTES 3: update the existing notes using post mothod: /api/notes//updatenotes/:id, login require
router.put("/updatenotes/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
// ROUTES 4: delete the existing notes using delete mothod: /api/notes/deletenotes/:id, login require
router.delete("/deletenotes/:id", fetchUser, async (req, res) => {
  try {  
  const { title, description, tag } = req.body;

  // Find the note to be delete and delete it
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(404).send("Not Found");
  }
  //  Allow deletetion only if user owns this notes;
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed");
  }
  note = await Notes.findByIdAndDelete(req.params.id);
  res.json({ Success: "Note has been deleted...", note: note });
} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server error");
}
});

module.exports = router;
