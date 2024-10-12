import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  tags: { 
    type: [String],
    default: [] 
  },
  category: {
    type: String,
    required: true,
  },
  editHistory: { 
    type: [{
      oldTitle: {type: String},
      oldContent: {type: String},
      oldCategory: {type:String},
      editedBy: { type: String },
      oldTags: { type: [String] }, 
      editedOn: { type: Date, default: Date.now },
    }],
    default: [] 
  },
  userId: {
     type: String, 
     required: true 
  },
  createdOn: { 
    type: Date, 
    default: Date.now,  
  },
});

const noteData = mongoose.model("Note", noteSchema, "Notes");



export default noteData
