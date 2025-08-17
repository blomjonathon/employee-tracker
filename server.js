const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection(
  {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "jonathon123",
    database: process.env.DB_NAME || "departments_db",
  },
  console.log(`Connected to the departments_db database.`)
);

// API Routes

// Get all departments
app.get('/api/departments', async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM department");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Get all roles
app.get('/api/roles', async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM role");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT * FROM employee");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Add a department
app.post('/api/departments', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Department name is required' });
    }
    
    const [result] = await db.promise().query(
      "INSERT INTO department (name) VALUES (?)",
      [name]
    );
    
    res.json({ 
      message: 'Department added successfully!',
      id: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add department' });
  }
});

// Add a role
app.post('/api/roles', async (req, res) => {
  try {
    const { title, salary, department_id } = req.body;
    if (!title || !salary || !department_id) {
      return res.status(400).json({ error: 'Title, salary, and department_id are required' });
    }
    
    const [result] = await db.promise().query(
      "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
      [title, salary, department_id]
    );
    
    res.json({ 
      message: 'Role added successfully!',
      id: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add role' });
  }
});

// Add an employee
app.post('/api/employees', async (req, res) => {
  try {
    const { fname, lname, role_id, manager_id } = req.body;
    if (!fname || !lname || !role_id) {
      return res.status(400).json({ error: 'First name, last name, and role_id are required' });
    }
    
    const [result] = await db.promise().query(
      "INSERT INTO employee (fname, lname, role_id, manager_id) VALUES (?, ?, ?, ?)",
      [fname, lname, role_id, manager_id || null]
    );
    
    res.json({ 
      message: 'Employee added successfully!',
      id: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

// Update employee role
app.put('/api/employees/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id } = req.body;
    
    if (!role_id) {
      return res.status(400).json({ error: 'Role ID is required' });
    }
    
    await db.promise().query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [role_id, id]
    );
    
    res.json({ message: 'Employee role updated successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update employee role' });
  }
});

// Get department names and IDs for dropdowns
app.get('/api/departments/list', async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT id, name FROM department");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch department list' });
  }
});

// Get roles for dropdowns
app.get('/api/roles/list', async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT id, title FROM role");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch role list' });
  }
});

// Get employees for dropdowns
app.get('/api/employees/list', async (req, res) => {
  try {
    const [results] = await db.promise().query("SELECT id, fname, lname FROM employee");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employee list' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
