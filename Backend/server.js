import express from "express";
import connectDB from "./config/db.js";
import taskRouter from "./routers/taskRouter.js";
import userRouter from "./routers/userRouter.js";
import cors from "cors"
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: [
        "https://taskmanager-psi-azure.vercel.app",
        "http://localhost:5173"
    ],
    credentials: true
}));
app.use(express.json());

app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}...`);
});
