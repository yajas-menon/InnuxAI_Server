// routes/clauseRoutes.js
const express = require('express');
const Clause = require('../models/Clause');
const router = express.Router();

// Route to add a new user-defined clause
router.post('/add_clause', async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const newClause = new Clause({
      title,
      content,
    });
    await newClause.save();
    res.status(201).json({ message: 'Clause added successfully', clause: newClause });
  } catch (err) {
    res.status(500).json({ message: 'Error adding clause', error: err.message });
  }
});

// Route to fetch all clauses (predefined and user-defined)
router.get('/clauses', async (req, res) => {
  try {
    const clauses = await Clause.find();
    res.status(200).json(clauses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching clauses', error: err.message });
  }
});

// Route to fetch predefined clauses only
router.get('/predefined_clauses', async (req, res) => {
  try {
    const predefinedClauses = await Clause.find({ userAdded: false });
    res.status(200).json(predefinedClauses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching predefined clauses', error: err.message });
  }
});

// Route to fetch user-added clauses
router.get('/user_clauses', async (req, res) => {
  try {
    const userClauses = await Clause.find({ userAdded: true });
    res.status(200).json(userClauses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user clauses', error: err.message });
  }
});

module.exports = router;
