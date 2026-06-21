import express from "express";
import {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
  toggleTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to protect all task routes
router.use(protect);

router.route("/").get(getTasks).post(createTask);
router.route("/:id").delete(deleteTask).patch(updateTask);
router.route("/:id/toggle").patch(toggleTask);

export default router;
