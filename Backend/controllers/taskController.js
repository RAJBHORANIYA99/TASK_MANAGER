import Task from "../models/taskModel.js";

<<<<<<< HEAD
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

=======
export const createTask = async (req, res) => {
  try {
    const { name, completed } = req.body; 
    if (!name) {
      return res.status(400).json({ msg: "Task name is required" });
    }
    const task = await Task.create({ name, completed });
>>>>>>> f8443c3f6bff49f2e96d082b42bd033978369ff3
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

<<<<<<< HEAD
// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
=======
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
>>>>>>> f8443c3f6bff49f2e96d082b42bd033978369ff3
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

<<<<<<< HEAD
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
    
=======
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${id}` });
    }
>>>>>>> f8443c3f6bff49f2e96d082b42bd033978369ff3
    res.status(200).json({ msg: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

<<<<<<< HEAD
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

=======
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${id}` });
    }
>>>>>>> f8443c3f6bff49f2e96d082b42bd033978369ff3
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};  

<<<<<<< HEAD
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
    
=======
export const toggleTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${id}` });
    }
    task.completed = !task.completed;
    await task.save();
>>>>>>> f8443c3f6bff49f2e96d082b42bd033978369ff3
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};