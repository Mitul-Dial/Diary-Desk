const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get All the Notes using: GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be at least 5 characters").isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag, attachments, images, todoItems } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }

      const note = new Note({
        title,
        description,
        tag: tag || "General",
        attachments: attachments || [],
        images: images || [],
        todoItems: todoItems || [],
        user: req.user.id,
      });
      
      const savedNote = await note.save();
      res.json(savedNote);

    } catch (error) {
      console.error(error.message);
      res.status(500).send({
        success: false,
        error: "Internal Server Error"
      });
    }
  }
);

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag, attachments, images, todoItems } = req.body;

  try {
    // Create a newNote object
    const newNote = {};
    if (title) { newNote.title = title; }
    if (description) { newNote.description = description; }
    if (tag) { newNote.tag = tag; }
    if (attachments !== undefined) { newNote.attachments = attachments; }
    if (images !== undefined) { newNote.images = images; }
    if (todoItems !== undefined) { newNote.todoItems = todoItems; }
    newNote.updatedAt = Date.now();

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send({
        success: false,
        error: "Note not found"
      });
    }

    // Allow update only if user owns this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send({
        success: false,
        error: "Not Allowed"
      });
    }
    
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send({
        success: false,
        error: "Note not found"
      });
    }

    // Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send({
        success: false,
        error: "Not Allowed"
      });
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true, 
      message: "Note has been deleted", 
      note: note 
    });
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 5: Search notes using: GET "/api/notes/search". Login required
router.get("/search", fetchuser, async (req, res) => {
  try {
    const { q, tag, sortBy } = req.query;
    let query = { user: req.user.id };

    // Build search query
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tag: { $regex: q, $options: 'i' } }
      ];
    }

    if (tag) {
      query.tag = { $regex: tag, $options: 'i' };
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'dateModified':
        sortOptions = { updatedAt: -1 };
        break;
      case 'alphabetical':
        sortOptions = { title: 1 };
        break;
      case 'alphabeticalDesc':
        sortOptions = { title: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const notes = await Note.find(query).sort(sortOptions);
    res.json(notes);

  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 6: Get note statistics: GET "/api/notes/stats". Login required
router.get("/stats", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    
    const stats = {
      totalNotes: notes.length,
      totalWords: 0,
      totalCharacters: 0,
      totalTodos: 0,
      completedTodos: 0,
      notesWithImages: 0,
      notesWithAttachments: 0,
      tagCount: {}
    };

    notes.forEach(note => {
      // Count words and characters
      const text = (note.title + ' ' + note.description).trim();
      stats.totalWords += text.split(/\s+/).length;
      stats.totalCharacters += text.length;

      // Count todos
      if (note.todoItems && note.todoItems.length > 0) {
        stats.totalTodos += note.todoItems.length;
        stats.completedTodos += note.todoItems.filter(todo => todo.completed).length;
      }

      // Count notes with media
      if (note.images && note.images.length > 0) {
        stats.notesWithImages++;
      }
      if (note.attachments && note.attachments.length > 0) {
        stats.notesWithAttachments++;
      }

      // Count tags
      if (note.tag) {
        const tags = note.tag.split(',').map(tag => tag.trim()).filter(tag => tag);
        tags.forEach(tag => {
          stats.tagCount[tag] = (stats.tagCount[tag] || 0) + 1;
        });
      }
    });

    res.json(stats);

  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 7: Get unique tags: GET "/api/notes/tags". Login required
router.get("/tags", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).select('tag');
    const tagSet = new Set();

    notes.forEach(note => {
      if (note.tag) {
        const tags = note.tag.split(',').map(tag => tag.trim()).filter(tag => tag);
        tags.forEach(tag => tagSet.add(tag));
      }
    });

    const uniqueTags = Array.from(tagSet).sort();
    res.json(uniqueTags);

  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 8: Duplicate a note: POST "/api/notes/duplicate/:id". Login required
router.post("/duplicate/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be duplicated
    let originalNote = await Note.findById(req.params.id);
    if (!originalNote) {
      return res.status(404).send({
        success: false,
        error: "Note not found"
      });
    }

    // Allow duplication only if user owns this Note
    if (originalNote.user.toString() !== req.user.id) {
      return res.status(401).send({
        success: false,
        error: "Not Allowed"
      });
    }

    // Create duplicate note
    const duplicateNote = new Note({
      title: `${originalNote.title} (Copy)`,
      description: originalNote.description,
      tag: originalNote.tag,
      attachments: originalNote.attachments,
      images: originalNote.images,
      todoItems: originalNote.todoItems,
      user: req.user.id,
    });

    const savedNote = await duplicateNote.save();
    res.json(savedNote);

  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 9: Bulk delete notes: DELETE "/api/notes/bulk-delete". Login required
router.delete("/bulk-delete", fetchuser, async (req, res) => {
  try {
    const { noteIds } = req.body;

    if (!noteIds || !Array.isArray(noteIds) || noteIds.length === 0) {
      return res.status(400).send({
        success: false,
        error: "Invalid note IDs provided"
      });
    }

    // Verify all notes belong to the user
    const notes = await Note.find({ 
      _id: { $in: noteIds }, 
      user: req.user.id 
    });

    if (notes.length !== noteIds.length) {
      return res.status(401).send({
        success: false,
        error: "Some notes don't belong to you or don't exist"
      });
    }

    // Delete the notes
    const result = await Note.deleteMany({ 
      _id: { $in: noteIds }, 
      user: req.user.id 
    });

    res.json({ 
      success: true, 
      message: `${result.deletedCount} notes deleted successfully`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 10: Export notes: GET "/api/notes/export". Login required
router.get("/export", fetchuser, async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="diary-desk-notes.json"');
      res.json(notes);
    } else if (format === 'csv') {
      // Simple CSV export
      const csvHeader = 'Title,Description,Tag,Created Date,Updated Date\n';
      const csvData = notes.map(note => {
        const title = `"${note.title.replace(/"/g, '""')}"`;
        const description = `"${note.description.replace(/"/g, '""')}"`;
        const tag = `"${note.tag || ''}"`;
        const createdAt = new Date(note.createdAt).toISOString();
        const updatedAt = new Date(note.updatedAt).toISOString();
        return `${title},${description},${tag},${createdAt},${updatedAt}`;
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="diary-desk-notes.csv"');
      res.send(csvHeader + csvData);
    } else {
      res.status(400).send({
        success: false,
        error: "Invalid format. Supported formats: json, csv"
      });
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      error: "Internal Server Error"
    });
  }
});

module.exports = router;