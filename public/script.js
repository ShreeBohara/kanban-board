// script.js

const board = document.getElementById('board');
const searchInput = document.getElementById('search');

let columnsData = [];
let tasksData = [];

// Fetch columns and tasks from the API
async function fetchData(query = '') {
  try {
    const columnsRes = await fetch('/api/columns');
    columnsData = await columnsRes.json();

    // If a search query is present, pass it as a query parameter
    const tasksRes = await fetch(`/api/tasks?q=${encodeURIComponent(query)}`);
    tasksData = await tasksRes.json();

    renderBoard();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Render board columns and tasks, and add an "Add Task" button in each column
function renderBoard() {
  board.innerHTML = '';

  const addColumnBtn = document.createElement('button');
  addColumnBtn.textContent = 'Add Column';
  addColumnBtn.addEventListener('click', () => {
    const columnTitle = prompt("Enter column title:");
    if (columnTitle) {
      createColumn(columnTitle);
    }
  });
  board.appendChild(addColumnBtn);

  columnsData.forEach(column => {
    // Create column container
    const columnEl = document.createElement('div');
    columnEl.className = 'column';
    columnEl.dataset.id = column.id;
    
    // Column header with title
    const header = document.createElement('div');
    header.className = 'column-header';
    header.innerHTML = `<h3>${column.title}</h3>`;
    columnEl.appendChild(header);
    
    // Container for tasks
    const tasksContainer = document.createElement('div');
    tasksContainer.className = 'tasks';
    tasksContainer.dataset.columnId = column.id;
    
    // Filter tasks belonging to this column and sort by position
    const columnTasks = tasksData
      .filter(task => task.column_id == column.id)
      .sort((a, b) => a.position - b.position);
    
    columnTasks.forEach(task => {
      const taskEl = document.createElement('div');
      taskEl.className = 'task';
      taskEl.draggable = true;
      taskEl.dataset.id = task.id;
      taskEl.textContent = task.title;

      // Add drag event listeners
      taskEl.addEventListener('dragstart', handleDragStart);
      taskEl.addEventListener('dragend', handleDragEnd);
      
      tasksContainer.appendChild(taskEl);
    });
    
    // Add dragover and drop event listeners to the tasks container
    tasksContainer.addEventListener('dragover', handleDragOver);
    tasksContainer.addEventListener('drop', handleDrop);
    
    columnEl.appendChild(tasksContainer);
    
    // Create and add the "Add Task" button for this column
    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = 'Add Task';
    addTaskButton.addEventListener('click', () => {
      addTask(column.id);
    });
    columnEl.appendChild(addTaskButton);
    
    board.appendChild(columnEl);
  });
}

// Drag and Drop Handlers
let draggedTask = null;

function handleDragStart(e) {
  draggedTask = e.target;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', e.target.dataset.id);
}

function handleDragEnd() {
  draggedTask = null;
  document.querySelectorAll('.tasks').forEach(container => {
    container.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  const targetContainer = e.currentTarget;
  targetContainer.classList.remove('drag-over');
  
  // Append the dragged task to the new container in the UI
  targetContainer.appendChild(draggedTask);
  
  // Update task's column_id and position
  const newColumnId = targetContainer.dataset.columnId;
  const taskId = draggedTask.dataset.id;
  
  // Calculate new position (e.g., index within the container)
  const tasks = Array.from(targetContainer.querySelectorAll('.task'));
  const newPosition = tasks.indexOf(draggedTask);
  
  // Update on server
  updateTask(taskId, newColumnId, newPosition);
}


// Function to call the API to create a column
async function createColumn(title) {
  // Decide what position to give the new column
  // For example, the next position is columnsData.length
  const position = columnsData.length;

  try {
    const res = await fetch('/api/columns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, position })
    });
    const newColumn = await res.json();

    // Re-fetch data to see the new column
    fetchData(searchInput.value);
  } catch (error) {
    console.error('Error creating column:', error);
  }
}


// Function to update task on the server via API
async function updateTask(taskId, newColumnId, newPosition) {
  // For simplicity, we assume title/description remain unchanged.
  const task = tasksData.find(t => t.id == taskId);
  const updatedTask = {
    title: task.title,
    description: task.description,
    column_id: newColumnId,
    position: newPosition
  };
  
  try {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask)
    });
    // Refresh data after update
    fetchData(searchInput.value);
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

// Function to add a new task via the API
function addTask(columnId) {
  const title = prompt("Enter task title:");
  if (!title) return;
  
  // Determine new position by counting tasks in the column
  const tasksInColumn = tasksData.filter(task => task.column_id == columnId);
  const position = tasksInColumn.length;
  
  fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description: '', column_id: columnId, position })
  })
  .then(res => res.json())
  .then(data => {
    // Refresh board after adding the new task
    fetchData(searchInput.value);
  })
  .catch(err => console.error('Error creating task:', err));
}

// Search functionality: filter tasks as user types
searchInput.addEventListener('input', () => {
  fetchData(searchInput.value);
});

// Initial data fetch
fetchData();
