import express from "express";
import cors from "cors";
import connectDB from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";





const app = express();

app.use(
    cors({
      origin: "*",
    })
  ); // เปิดใช้งาน CORS
app.use(express.json());

app.use("/api/users", userRoutes)
app.use("/api/features", noteRoutes)

connectDB();

export default app;