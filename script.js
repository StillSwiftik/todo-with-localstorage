const form = document.querySelector('.form')
const taskInput = document.querySelector('.task-input')
const taskList = document.querySelector('.task-list')
const emptyTaskList = document.querySelector('.empty-list')
const TaskItems = document.querySelector('.title-list')
const pendingTaskItems = document.querySelector('.done-list')
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);
const addTask = (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        showError('Ошибка! Введите текст');
        return;
    }

    if (isTaskDuplicate(taskText)) {
        showError('Ошибка! Такое задание уже существует');
        return;
    }

    const task = {
        text: taskText,
        completed: false
    };

    addTaskToDOM(task);
    saveTaskToLocalStorage(task);

    taskInput.value = '';
    document.querySelector('.error').classList.add('none');
    updateTaskCount();
};
function showError(message) {
    const errorElement = document.querySelector('.error');
    errorElement.classList.remove('none');
    errorElement.textContent = message;
}
function isTaskDuplicate(taskText) {
    const tasks = getTasksFromLocalStorage();
    return tasks.some(task => task.text === taskText);
}
function addTaskToDOM(task) {
    const taskHTML = `
    <li class="list-group-item">
        <button class="btn-action btn-done" data-action="done">
            <div class="${task.completed ? 'doned' : ''}"><i class="fa-solid fa-check ${task.completed ? 'doned' : ''}"></i></div>
        </button>
        <span class="task-title ${task.completed ? 'line' : ''}">${task.text}</span>
        <button class="btn-action btn-delete" data-action="delete">
            <div><i class="fa-solid fa-trash-can"></i></div>
        </button>
    </li>
    `;
    taskList.insertAdjacentHTML('beforeend', taskHTML);
    if (taskList.children.length > 1) emptyTaskList.classList.add('none');
}
function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadTasksFromLocalStorage() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => addTaskToDOM(task));
    updateTaskCount();
}
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}
function updateTaskInLocalStorage(updatedTask) {
    const tasks = getTasksFromLocalStorage();
    const updatedTasks = tasks.map(task => task.text === updatedTask.text ? updatedTask : task);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}
function deleteTaskFromLocalStorage(taskText) {
    const tasks = getTasksFromLocalStorage();
    const filteredTasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
}
const deleteTask = e => {
    if (e.target.closest('button')?.dataset.action === 'delete') {
        const parentNode = e.target.closest('.list-group-item');
        const taskTitle = parentNode.querySelector('.task-title').textContent;
        deleteTaskFromLocalStorage(taskTitle);
        parentNode.remove();
        updateTaskCount();
    }
    if (taskList.children.length === 1) emptyTaskList.classList.remove('none');
};
const doneTask = e => {
    if (e.target.closest('button')?.dataset.action === 'done') {
        const parentNode = e.target.closest('.list-group-item');
        const taskTitle = parentNode.querySelector('.task-title');
        const taskText = taskTitle.textContent;
        taskTitle.classList.toggle('line');
        parentNode.querySelector('div').classList.toggle('doned');
        parentNode.querySelector('i').classList.toggle('doned');
        const updatedTask = {
            text: taskText,
            completed: taskTitle.classList.contains('line')
        };
        updateTaskInLocalStorage(updatedTask);
        updateTaskCount();
    }
};
function updateTaskCount() {
    TaskItems.textContent = `You have ${taskList.children.length - 1} tasks`;
    pendingTaskItems.textContent = `You have ${taskList.querySelectorAll('.line').length} completed tasks`;
}
function clearCompletedTasks() {
    const tasks = getTasksFromLocalStorage();
    const incompleteTasks = tasks.filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(incompleteTasks));
    taskList.innerHTML = '';
    incompleteTasks.forEach(task => addTaskToDOM(task));
    updateTaskCount();
}
form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);
