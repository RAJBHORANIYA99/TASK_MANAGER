import express from "express";
import connectDB from "./config/db.js";
import taskRouter from "./routers/taskRouter.js";
import cors from "cors"
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app = express();
app.use(cors())
app.use(express.json());

app.use("/api/tasks", taskRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}...`);
});
