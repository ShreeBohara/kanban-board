// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const columnsRoutes = require('./routes/columns');
const tasksRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from public folder
app.use(express.static('public'));

// API Routes
app.use('/api/columns', columnsRoutes);
app.use('/api/tasks', tasksRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
