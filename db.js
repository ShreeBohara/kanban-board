// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',      // update if necessary
  user: 'root',  // your MySQL username
  password: 'shree123',  // your MySQL password
  database: 'kanban_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit();
  }
  console.log('Connected to MySQL database.');
});

module.exports = connection;
