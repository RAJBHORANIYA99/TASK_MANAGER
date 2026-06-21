import Task from "../models/taskModel.js";

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { name, description, completed, priority, dueDate, category } = req.body;
    
    if (!name) {
      return res.status(400).json({ msg: "Task name is required" });
    }

    const task = await Task.create({
      user: req.user.id,
      name,
      description,
      completed: completed || false,
      priority: priority || "medium",
      dueDate,
      category: category || "Work",
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ msg: `No task found with id: ${id}` });
    }
    
    res.status(200).json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// @desc    Update a task
// @route   PATCH /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find task and verify it belongs to user
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ msg: `No task found with id: ${id}` });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};  

// @desc    Toggle task completion status
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
export const toggleTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findOne({ _id: id, user: req.user.id });
    
    if (!task) {
      return res.status(404).json({ msg: `No task found with id: ${id}` });
    }
    
    task.completed = !task.completed;
    await task.save();
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};