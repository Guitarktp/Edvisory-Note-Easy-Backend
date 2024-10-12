import express from "express";
import noteData from "../models/note.js";
import authenticateMiddleware from "../middleware/authenticateMiddleware.js";

const router = express.Router();

// API - Add note

router.post("/add-note", authenticateMiddleware, async (req, res) => {
  const { title, content, author, category, tags } = req.body;
  const user = req.user;
  // console.log(user)
  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res
      .status(400)
      .json({ error: true, message: "Content is required" });
  }
  if (!author){
    return res
    .status(400)
    .json({ error: true, message: "Author is required"})
  }
  if (!category){
    return res
    .status(400)
    .json({ error: true, message: "Category is required"})
  }
  try {
    const newNote = new noteData({
      title,
      content,
      author,
      category,
      tags: tags || [],
      userId: user._id,
    });
    
    newNote.editHistory.push({
      oldTitle: newNote.title,
      oldContent: newNote.content,
      oldTags: newNote.tags,
      oldCategory: newNote.category,
      editedBy: newNote.author,
      editedOn: new Date(),
    });

    await newNote.save();
    return res.json({
      data: newNote,
      message: "Note added successful",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});


// API - Edit note
router.put("/edit-note/:noteId", authenticateMiddleware, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, author, tags, category, isPinned } = req.body;
    const user = req.user;
  
    if (!title && !content && !author && !category && !tags ) {
      return res
        .status(400)
        .json({ error: true, message: "No changes provided" });
    }
    try {
      const noteInfo = await noteData.findOne({ _id: noteId, userId: user._id });
  
      // console.log(noteInfo);
  
      if (!noteInfo) {
        return res.status(404).json({ error: true, message: "Note not found" });
      }
  
      if (title) noteInfo.title = title;
      if (content) noteInfo.content = content;
      if (author) noteInfo.author = author;
      if (category) noteInfo.category = category;
      if (tags) noteInfo.tags = tags;
      if (isPinned) noteInfo.isPinned = isPinned;
  
      noteInfo.editHistory.push({
        oldTitle: noteInfo.title,
        oldContent: noteInfo.content,
        oldTags: noteInfo.tags,
        oldCategory: noteInfo.category,
        editedBy: noteInfo.author,
        editedOn: new Date(),
      });
  
      await noteInfo.save();
      return res.json({
        error: false,
        noteInfo,
        message: "Note updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  });


export default router;