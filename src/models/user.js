import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    sparse: true,  // เพื่อให้ index ไม่รวมเอกสารที่ email เป็น null
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  createdOn: { 
    type: Date, 
    default: Date.now,  // ใช้ Date.now เพื่อให้ค่า default เป็นวันที่ในปัจจุบัน
  },
});

const UserData = mongoose.model("User", userSchema, "Users");

export default UserData;
