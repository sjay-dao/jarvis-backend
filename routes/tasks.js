// routes/tasks.js
const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const chrono = require("chrono-node"); 
const TASKS_COLLECTION = "tasks";

// Add task
router.post("/add", async (req, res) => {
    try {
      const { input } = req.body; // changed from full form to single natural input
  
      // Step 1: Parse date/time from input
      const parsedDate = chrono.parseDate(input);
  
      // Step 2: Clean description (remove time-related parts)
      const parsedResults = chrono.parse(input);
        let cleanedDescription = input;

        if (parsedResults.length > 0) {
        const { index, text } = parsedResults[0]; // take the first date match
        cleanedDescription =
            input.slice(0, index) + input.slice(index + text.length);
        }

      const description = cleanedDescription.trim();
      
      const newTask = {
        description,
        category: "General", // You can enhance this later
        dueDate: parsedDate || null,
        priority: "Medium",
        isDone: false,
        createdAt: new Date(),
      };
  
      const docRef = await db.collection("tasks").add(newTask);
      res.status(200).json({ id: docRef.id, ...newTask });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add task" });
    }
  });

// Get tasks
router.get("/all", async (req, res) => {
  try {
    const snapshot = await db.collection(TASKS_COLLECTION).orderBy("createdAt", "desc").get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});


// Mark task as done/undone
router.patch("/done/:id", async (req, res) => {
  try {
    const { isDone } = req.body;
    const { id } = req.params;
    await db.collection("tasks").doc(id).update({ isDone });
    res.status(200).json({ message: "Task updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("tasks").doc(id).delete();
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
