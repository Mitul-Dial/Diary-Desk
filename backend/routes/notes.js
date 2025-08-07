const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");

// ROUTE 1: Get All the Notes using: GET "/api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    // Only fetch notes that belong to the authenticated user
    const notes = await Note.find({ user: req.user.id }).sort({ date: -1 });
    res.json({
      success: true,
      notes: notes
    });
  } catch (error) {
    console.error('Fetch notes error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 2: Add a new Note using: POST "/api/notes/addnote". Login required
router.post("/addnote", fetchuser, async (req, res) => {
  try {
    const { title, description, tag, attachments, images, todoItems } = req.body;

    // Simple validation
    if (!title || title.length < 3) {
      return res.status(400).json({ 
        success: false,
        error: "Title must be at least 3 characters long" 
      });
    }

    if (!description || description.length < 5) {
      return res.status(400).json({ 
        success: false,
        error: "Description must be at least 5 characters long" 
      });
    }

    const note = new Note({
      title: title.trim(),
      description: description.trim(),
      tag: tag ? tag.trim() : "General",
      attachments: attachments || [],
      images: images || [],
      todoItems: todoItems || [],
      user: req.user.id, // Ensure note is associated with the authenticated user
    });
    
    const savedNote = await note.save();
    
    res.json({
      success: true,
      note: savedNote
    });

  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag, attachments, images, todoItems } = req.body;

  try {
    // Create a newNote object
    const newNote = {};
    if (title) { newNote.title = title.trim(); }
    if (description) { newNote.description = description.trim(); }
    if (tag) { newNote.tag = tag.trim(); }
    if (attachments !== undefined) { newNote.attachments = attachments; }
    if (images !== undefined) { newNote.images = images; }
    if (todoItems !== undefined) { newNote.todoItems = todoItems; }
    newNote.updatedAt = Date.now();

    // Find the note to be updated and update it
    // Only find notes that belong to the authenticated user
    let note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found or you don't have permission to update it"
      });
    }
    
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    
    res.json({ 
      success: true,
      note: note 
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted and delete it
    //Only find notes that belong to the authenticated user
    let note = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: "Note not found or you don't have permission to delete it"
      });
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true, 
      message: "Note has been deleted", 
      note: note 
    });
    
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 5: Search notes using: GET "/api/notes/search". Login required
router.get("/search", fetchuser, async (req, res) => {
  try {
    const { q, tag, sortBy } = req.query;
    
    // Only search within the authenticated user's notes
    let query = { user: req.user.id };

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
        sortOptions = { date: -1 };
    }

    const notes = await Note.find(query).sort(sortOptions);
    res.json({
      success: true,
      notes: notes
    });

  } catch (error) {
    console.error('Search notes error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 6: Get note statistics: GET "/api/notes/stats". Login required
router.get("/stats", fetchuser, async (req, res) => {
  try {
    //Only get stats for the authenticated user's notes
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
      const text = (note.title + ' ' + note.description).trim();
      if (text) {
        stats.totalWords += text.split(/\s+/).filter(word => word.length > 0).length;
        stats.totalCharacters += text.length;
      }

      if (note.todoItems && note.todoItems.length > 0) {
        stats.totalTodos += note.todoItems.length;
        stats.completedTodos += note.todoItems.filter(todo => todo.completed).length;
      }

      if (note.images && note.images.length > 0) {
        stats.notesWithImages++;
      }
      if (note.attachments && note.attachments.length > 0) {
        stats.notesWithAttachments++;
      }
      if (note.tag) {
        const tags = note.tag.split(',').map(tag => tag.trim()).filter(tag => tag);
        tags.forEach(tag => {
          stats.tagCount[tag] = (stats.tagCount[tag] || 0) + 1;
        });
      }
    });

    res.json({
      success: true,
      stats: stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 7: Get unique tags: GET "/api/notes/tags". Login required
router.get("/tags", fetchuser, async (req, res) => {
  try {
    //Only get tags from the authenticated user's notes
    const notes = await Note.find({ user: req.user.id }).select('tag');
    const tagSet = new Set();

    notes.forEach(note => {
      if (note.tag) {
        const tags = note.tag.split(',').map(tag => tag.trim()).filter(tag => tag);
        tags.forEach(tag => tagSet.add(tag));
      }
    });

    const uniqueTags = Array.from(tagSet).sort();
    res.json({
      success: true,
      tags: uniqueTags
    });

  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 8: Duplicate a note: POST "/api/notes/duplicate/:id". Login required
router.post("/duplicate/:id", fetchuser, async (req, res) => {
  try {
    // Find the note to be duplicated
    //Only find notes that belong to the authenticated user
    let originalNote = await Note.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!originalNote) {
      return res.status(404).json({
        success: false,
        error: "Note not found or you don't have permission to duplicate it"
      });
    }

    const duplicateNote = new Note({
      title: `${originalNote.title} (Copy)`,
      description: originalNote.description,
      tag: originalNote.tag,
      attachments: originalNote.attachments,
      images: originalNote.images,
      todoItems: originalNote.todoItems,
      user: req.user.id, // Ensure duplicate belongs to the authenticated user
    });

    const savedNote = await duplicateNote.save();
    res.json({
      success: true,
      note: savedNote
    });

  } catch (error) {
    console.error('Duplicate note error:', error);
    res.status(500).json({
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
      return res.status(400).json({
        success: false,
        error: "Invalid note IDs provided"
      });
    }

    //Only delete notes that belong to the authenticated user
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
    console.error('Bulk delete error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// ROUTE 10: Export notes: GET "/api/notes/export". Login required
router.get("/export", fetchuser, async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    
    //Only export the authenticated user's notes
    const notes = await Note.find({ user: req.user.id }).sort({ date: -1 });

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="diary-desk-notes.json"');
      res.json(notes);
    } else if (format === 'csv') {
      const csvHeader = 'Title,Description,Tag,Created Date,Updated Date\n';
      const csvData = notes.map(note => {
        const title = `"${note.title.replace(/"/g, '""')}"`;
        const description = `"${note.description.replace(/"/g, '""')}"`;
        const tag = `"${note.tag || ''}"`;
        const createdAt = new Date(note.date).toISOString();
        const updatedAt = new Date(note.updatedAt || note.date).toISOString();
        return `${title},${description},${tag},${createdAt},${updatedAt}`;
      }).join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="diary-desk-notes.csv"');
      res.send(csvHeader + csvData);
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid format. Supported formats: json, csv"
      });
    }

  } catch (error) {
    console.error('Export notes error:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

module.exports = router;