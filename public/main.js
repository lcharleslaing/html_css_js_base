// Task Manager with Local Storage
class TaskManager {
    constructor() {
        this.tasks = [];
        this.loadFromLocalStorage();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('taskForm');
        const input = document.getElementById('taskInput');
        const list = document.getElementById('taskList');

        // Load initial tasks
        this.renderTasks();

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const value = input.value.trim();
            if (!value) return;

            if (this.editingTaskId) {
                this.updateTask(this.editingTaskId, value);
                this.resetForm();
            } else {
                this.addTask(value);
            }

            input.value = '';
            input.focus();
        });

        // Clear completed button
        document.getElementById('clearCompleted')?.addEventListener('click', () => {
            this.clearCompletedTasks();
        });

        // Clear all button
        document.getElementById('clearAll')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all tasks?')) {
                this.clearAllTasks();
            }
        });
    }

    loadFromLocalStorage() {
        const savedTasks = localStorage.getItem('tasks');
        this.tasks = savedTasks ? JSON.parse(savedTasks) : [];
    }

    saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        this.updateStats();
    }

    addTask(text) {
        const task = {
            id: Date.now().toString(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveToLocalStorage();
        this.renderTasks();
    }

    updateTask(id, newText) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.text = newText;
            this.saveToLocalStorage();
            this.renderTasks();
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToLocalStorage();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveToLocalStorage();
        this.renderTasks();
    }

    clearCompletedTasks() {
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveToLocalStorage();
        this.renderTasks();
    }

    clearAllTasks() {
        this.tasks = [];
        this.saveToLocalStorage();
        this.renderTasks();
    }

    resetForm() {
        const formTitle = document.getElementById('formTitle');
        const submitBtn = document.getElementById('submitBtn');
        const input = document.getElementById('taskInput');

        formTitle.textContent = 'Add a Task';
        submitBtn.textContent = 'Add Task';
        input.value = '';
        this.editingTaskId = null;
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'card bg-base-100 shadow-lg';
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="card-body p-4 flex-row items-center justify-between">
                <div class="flex items-center gap-3 flex-1">
                    <input type="checkbox" class="checkbox" 
                        ${task.completed ? 'checked' : ''}>
                    <span class="${task.completed ? 'line-through opacity-50' : ''}">${task.text}</span>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-sm btn-ghost btn-warning" data-action="edit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button class="btn btn-sm btn-ghost btn-error" data-action="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const checkbox = li.querySelector('input[type="checkbox"]');
        const editBtn = li.querySelector('[data-action="edit"]');
        const deleteBtn = li.querySelector('[data-action="delete"]');

        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        editBtn.addEventListener('click', () => this.startEditing(task));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        return li;
    }

    startEditing(task) {
        const input = document.getElementById('taskInput');
        const formTitle = document.getElementById('formTitle');
        const submitBtn = document.getElementById('submitBtn');

        input.value = task.text;
        input.focus();
        formTitle.textContent = 'Edit Task';
        submitBtn.textContent = 'Update Task';
        this.editingTaskId = task.id;
    }

    renderTasks() {
        const list = document.getElementById('taskList');
        list.innerHTML = '';
        this.tasks
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .forEach(task => {
                list.appendChild(this.createTaskElement(task));
            });
        this.updateStats();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const remaining = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('remainingTasks').textContent = remaining;
    }
}

// Initialize the task manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TaskManager();
});
