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


export default router;