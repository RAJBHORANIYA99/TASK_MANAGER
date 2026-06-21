import express from "express";
import connectDB from "./config/db.js";
import taskRouter from "./routers/taskRouter.js";
<<<<<<< HEAD
import userRouter from "./routers/userRouter.js";
=======
>>>>>>> f8443c3f6bff49f2e96d082b42bd033978369ff3
import cors from "cors"
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app = express();
app.use(cors())
app.use(express.json());

app.use("/api/tasks", taskRouter);
<<<<<<< HEAD
app.use("/api/users", userRouter);
=======
>>>>>>> f8443c3f6bff49f2e96d082b42bd033978369ff3

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}...`);
});
