# 🗂️ Kanban Board – Trello Clone

A responsive and customizable Kanban board inspired by Trello, built with **Node.js**, **Express.js**, **MySQL**, and **vanilla JavaScript**. Features include drag-and-drop task movement, search functionality, and persistent task and column storage.

## 🚀 Features

- Customizable columns (To Do, In Progress, Done, etc.)
- Add, update, and delete tasks
- Drag-and-drop support for task reordering and movement across columns
- Real-time search/filtering by task name
- Persistent data using MySQL backend
- Responsive design for various screen sizes

## 📂 Project Structure

kanban-board/  
├── server.js          # Express server  
├── db.js              # MySQL DB connection  
├── routes/  
│   ├── columns.js     # API routes for columns  
│   └── tasks.js       # API routes for tasks  
├── public/  
│   ├── index.html     # UI markup  
│   ├── style.css      # Stylesheet  
│   └── script.js      # Frontend logic  
├── package.json  
└── README.md  

## ⚙️ Setup & Run

1. **Clone and Install Dependencies**

```bash
git clone https://github.com/your-username/kanban-board.git
cd kanban-board
npm install


Create the MySQL Database

CREATE DATABASE kanban_db;
USE kanban_db;

CREATE TABLE columns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  position INT NOT NULL DEFAULT 0
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  column_id INT,
  position INT NOT NULL DEFAULT 0,
  FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
);



Configure DB Connection in db.js

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'kanban_db'
});

Start the Server

node server.js


Open in Browser

Go to: http://localhost:3000

🧪 Usage
Add columns (via SQL or implement frontend support)

Click “Add Task” under a column to create a task

Drag tasks to reorder or move between columns

Use the search box to filter tasks by title

🧩 Future Enhancements
Add/edit columns from UI

Edit task titles and descriptions via modal

Drag-and-drop column ordering

User login & authentication

Light/Dark mode toggle

👤 Author
Shree Bohara
📫 shree.b@example.com
🔗 LinkedIn


