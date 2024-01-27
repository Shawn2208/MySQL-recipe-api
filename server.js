const express = require('express');
const mysql = require('mysql');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = 3000;

// Create a MySQL database connection
const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to the database');
});

// Parse JSON request bodies
app.use(express.json());
app.use(cors());

// Define POST endpoint to create a new recipe
app.post('/recipes', (req, res) => {
  const { title, description, instructions, prep_time, cook_time, servings, image_url } = req.body;

  // Check if all required fields are provided
  if (!title || !description || !instructions || !prep_time || !cook_time || !servings || !image_url) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newRecipe = {
    title,
    description,
    instructions,
    prep_time,
    cook_time,
    servings,
    image_url,
  };

  const sql = 'INSERT INTO recipes SET ?';
  db.query(sql, newRecipe, (err, result) => {
    if (err) {
      throw err;
    }
    res.status(201).json({ message: 'Recipe created successfully', recipeId: result.insertId });
  });
});

// Define API endpoints

// Get all recipes
app.get('/recipes', (req, res) => {
  const sql = 'SELECT * FROM recipes';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// Update a recipe
app.put('/recipes/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, instructions, prep_time, cook_time, servings, image_url } = req.body;

  // SQL query to update the recipe
  const sql = `UPDATE recipes SET title = ?, description = ?, instructions = ?, prep_time = ?, cook_time = ?, servings = ?, image_url = ? WHERE id = ?`;

  db.query(sql, [title, description, instructions, prep_time, cook_time, servings, image_url, id], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe updated successfully' });
  });
});

  
  // Delete a recipe
app.delete('/recipes/:id', (req, res) => {
  const { id } = req.params;

  // SQL query to delete the recipe
  const sql = `DELETE FROM recipes WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  });
});
  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
