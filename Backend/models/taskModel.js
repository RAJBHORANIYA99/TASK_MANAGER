import mongoose from "mongoose";

<<<<<<< HEAD
const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Task name is required"],
      minlength: [3, "Task name must be at least 3 characters"],
      maxlength: [100, "Task name must not exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    category: {
      type: String,
      trim: true,
      default: "Work",
    },
  },
  {
    timestamps: true,
  }
);
=======
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
>>>>>>> f8443c3f6bff49f2e96d082b42bd033978369ff3

const Task = mongoose.model("Task", TaskSchema);

export default Task;
