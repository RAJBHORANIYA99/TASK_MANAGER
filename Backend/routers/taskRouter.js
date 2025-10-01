import express from "express";
import { createTask, getTasks, deleteTask, updateTask, toggleTask} from "../controllers/taskController.js";

const router = express.Router();

router.route("/").get(getTasks).post(createTask);
router.route("/:id").delete(deleteTask).patch(updateTask);
router.route("/:id/toggle").patch(toggleTask);

export default router;
