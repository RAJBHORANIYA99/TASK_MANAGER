import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: [true, "Task name must be unique"],
    required: [true, "Task name is required"],
    minlength: [3, "Task name must be at least 3 characters"],
    maxlength: [100, "Task name must not exceed 100 characters"],
  },
  completed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;
