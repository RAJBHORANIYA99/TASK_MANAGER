import express from "express";
<<<<<<< HEAD
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

=======
import { createTask, getTasks, deleteTask, updateTask, toggleTask} from "../controllers/taskController.js";

const router = express.Router();

>>>>>>> f8443c3f6bff49f2e96d082b42bd033978369ff3
router.route("/").get(getTasks).post(createTask);
router.route("/:id").delete(deleteTask).patch(updateTask);
router.route("/:id/toggle").patch(toggleTask);

export default router;
