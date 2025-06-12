const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Load student data from JSON file
const studentsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'student_data.json'), 'utf-8'));

// Search endpoint
app.get('/api/students/search', (req, res) => {
  const { query, limit = 5 } = req.query;
  
  if (!query || query.length < 3) {
    return res.status(400).json({ error: 'Query must be at least 3 characters long' });
  }

  const searchQuery = query.toLowerCase();
  
  const results = studentsData
    .filter(student => 
      student.name.toLowerCase().includes(searchQuery)
    )
    .slice(0, limit);

  res.json(results);
});

// Get all students (for testing)
app.get('/api/students', (req, res) => {
  res.json(studentsData);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
