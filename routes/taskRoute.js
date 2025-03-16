const express = require("express");
const Task = require("../models/taskModel");
const User = require("../models/userModels");

const router = express.Router();

// Get tasks by user email
router.get("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const tasks = await Task.find({ userId: user._id }); // Ensure "userId" matches schema
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Add new task
router.post("/", async (req, res) => {
  try {
    const { title, email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const newTask = new Task({
      title,
      completed: false,
      userId: user._id,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
});

// Update task
router.put("/:id", async (req, res) => {
  try {
    const { title, completed } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, completed },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ message: "Task not found" });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
});

module.exports = router;
