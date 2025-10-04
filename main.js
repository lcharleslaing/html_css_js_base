function addTask() {
  const input = document.getElementById('taskInput');
  const list = document.getElementById('taskList');
  const value = input.value.trim();

  if (!value) return;

  const li = document.createElement('li');
  li.className = "flex justify-between items-center bg-base-100 px-4 py-2 rounded-lg shadow hover:bg-base-300 transition";

  li.innerHTML = `
    <span>${value}</span>
    <button class="btn btn-xs btn-error" onclick="this.parentElement.remove()">✕</button>
  `;

  list.appendChild(li);
  input.value = '';
  input.focus();
}
