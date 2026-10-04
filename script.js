const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const errorMessage = document.getElementById('error-message');
const todoList = document.getElementById('todo-list');
const totalCountEl = document.getElementById('total-count');
const remainingCountEl = document.getElementById('remaining-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');

let tasks = [];

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  errorMessage.hidden = true;

  if (!text) {
    showError('Task cannot be empty.');
    return;
  }
  if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
    showError('This task already exists.');
    return;
  }

  tasks.push({ id: Date.now(), text: text, completed: false });
  render();
  todoForm.reset();
});

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.hidden = false;
}

function render() {
  todoList.innerHTML = '';
  
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';

  tasks.forEach(task => {
    if (activeFilter === 'active' && task.completed) return;
    if (activeFilter === 'completed' && !task.completed) return;

    const li = document.createElement('li');
    li.className = `todo-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    li.innerHTML = `
      <div class="todo-item-left">
        <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
      </div>
      <button class="delete-btn">Delete</button>
    `;
    todoList.appendChild(li);
  });

  totalCountEl.textContent = tasks.length;
  remainingCountEl.textContent = tasks.filter(t => !t.completed).length;
}

todoList.addEventListener('click', (e) => {
  const id = parseInt(e.target.closest('.todo-item')?.dataset.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  if (e.target.classList.contains('complete-checkbox')) {
    task.completed = e.target.checked;
    render();
  } else if (e.target.classList.contains('delete-btn')) {
    tasks = tasks.filter(t => t.id !== id);
    render();
  }
});

todoList.addEventListener('dblclick', (e) => {
  if (!e.target.classList.contains('task-text')) return;

  const parent = e.target.parentElement;
  const id = parseInt(e.target.closest('.todo-item').dataset.id);
  const task = tasks.find(t => t.id === id);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'edit-input';
  input.value = task.text;
  parent.replaceChild(input, e.target);
  input.focus();

  const finishEdit = (save) => {
    const newText = input.value.trim();
    if (save && newText && !tasks.some(t => t.id !== id && t.text.toLowerCase() === newText.toLowerCase())) {
      task.text = newText;
    }
    render();
  };

  input.addEventListener('blur', () => finishEdit(true));
  
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') finishEdit(true);
    if (event.key === 'Escape') finishEdit(false);
  });
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    render();
  });
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  render();
});

