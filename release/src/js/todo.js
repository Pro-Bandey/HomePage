// -----------------------------------------
// STORAGE WRAPPER (Works on Web + Extension)
// -----------------------------------------
const storage = {
  get: (key, callback) => {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([key], callback);
    } else {
      const data = localStorage.getItem(key);
      callback({ [key]: data ? JSON.parse(data) : null });
    }
  },

  set: (obj) => {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(obj);
    } else {
      for (const key in obj) {
        localStorage.setItem(key, JSON.stringify(obj[key]));
      }
    }
  }
};

// -----------------------------------------
// DOM ELEMENTS
// -----------------------------------------
const taskInput = document.getElementById("todo-input"),
  addBtn = document.getElementById("todo-add-btn"),
  todoList = document.getElementById("todo-list"),
  reminderInput = document.getElementById("reminder-input"),
  fontSelect = document.getElementById("fontSelect"),
  fontSizeInput = document.getElementById("fontSize"),
  reminderDialog = document.getElementById("reminderDialog"),
  reminderText = document.getElementById("reminderText"),
  closeReminder = document.getElementById("closeReminder");

// -----------------------------------------
// SAVE TASKS
// -----------------------------------------
function saveTasks() {
  const tasks = Array.from(todoList.children).map(li => ({
    text: li.querySelector(".todo-item-content").innerHTML,
    completed: li.querySelector(".morph-checkbox").classList.contains("checked"),
    font: li.querySelector(".todo-item-content").style.fontFamily,
    size: li.querySelector(".todo-item-content").style.fontSize,
    reminder: li.dataset.reminder || null,
    created: li.dataset.created
  }));
  storage.set({ tasks });
}

// -----------------------------------------
// UPDATE INDEX NUMBERS
// -----------------------------------------
function updateTaskIndexes() {
  Array.from(todoList.children).forEach((li, index) => {
    li.querySelector(".task-index").textContent = `Task No ${index + 1}. `;
  });
}

// -----------------------------------------
// CREATE SINGLE TASK
// -----------------------------------------
/*
function createTask(task, save = true) {
  const li = document.createElement("li");
  li.dataset.created = task.created || new Date().toISOString();
  li.dataset.reminder = task.reminder || "";

  // Controls
  const ctrlDiv = document.createElement("div");
  ctrlDiv.className = "ctrl-div";

  const taskIndex = document.createElement("p");
  taskIndex.className = "task-index";

  const checkbox = document.createElement("div");
  checkbox.className = "morph-checkbox";
  if (task.completed) checkbox.classList.add("checked");

  const delBtn = document.createElement("button");
  delBtn.className = "delete-btn";

  ctrlDiv.appendChild(taskIndex);
  ctrlDiv.appendChild(checkbox);
  ctrlDiv.appendChild(delBtn);
  li.appendChild(ctrlDiv);

  // Added date + reminder
  const topDiv = document.createElement("div");
  topDiv.className = "top";

  const addedOnDiv = document.createElement("div");
  addedOnDiv.style.display = "flex";

  const addedText = document.createElement("p");
  addedText.className = "added-on";
  addedText.textContent = "added on ";

  const addedDate = document.createElement("p");
  addedDate.textContent = new Date(li.dataset.created).toLocaleString();

  addedOnDiv.appendChild(addedText);
  addedOnDiv.appendChild(addedDate);

  const reminderTextDiv = document.createElement("div");
  reminderTextDiv.textContent = task.reminder
    ? `Reminder: ${new Date(task.reminder).toLocaleString()}`
    : "Reminder: Not set";

  topDiv.appendChild(addedOnDiv);
  topDiv.appendChild(reminderTextDiv);
  li.appendChild(topDiv);

  li.appendChild(document.createElement("hr"));

  // Task content
  const taskContent = document.createElement("p");
  taskContent.className = "todo-item-content";
  taskContent.innerHTML = task.text;
  taskContent.style.fontFamily = task.font;
  taskContent.style.fontSize = task.size;

  if (task.completed) {
    taskContent.style.textDecoration = "line-through";
    taskContent.style.color = "red";
    taskContent.style.opacity = "0.6";
  }

  li.appendChild(taskContent);

  // Checkbox toggle
  checkbox.onclick = () => {
    checkbox.classList.toggle("checked");

    if (checkbox.classList.contains("checked")) {
      taskContent.style.textDecoration = "line-through";
      taskContent.style.color = "red";
      taskContent.style.opacity = "0.6";
    } else {
      taskContent.style.textDecoration = "none";
      taskContent.style.color = "";
      taskContent.style.opacity = "1";
    }

    saveTasks();
  };

  // Delete
  delBtn.onclick = () => {
    li.remove();
    updateTaskIndexes();
    saveTasks();
  };

  todoList.appendChild(li);

  updateTaskIndexes();
  if (save) saveTasks();

  // If reminder set
  if (task.reminder) {
    scheduleReminder(task.reminder, task.created, task.text);
  }
}
*/
function createTask(task, save = true) {
  const li = document.createElement("li");
  li.dataset.created = task.created || new Date().toISOString();
  li.dataset.reminder = task.reminder || "";

  // Controls Container
  const ctrlDiv = document.createElement("div");
  ctrlDiv.className = "ctrl-div";

  const taskIndex = document.createElement("p");
  taskIndex.className = "task-index";

  const checkbox = document.createElement("div");
  checkbox.className = "morph-checkbox";
  if (task.completed) checkbox.classList.add("checked");

  // --- NEW: Copy Button ---
  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.title = "Copy Task";

  // --- NEW: Edit Button ---
  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.title = "Edit Task";

  const delBtn = document.createElement("button");
  delBtn.className = "delete-btn";

  // Append buttons to control div
  ctrlDiv.appendChild(taskIndex);
  ctrlDiv.appendChild(checkbox);
  ctrlDiv.appendChild(copyBtn); 
  ctrlDiv.appendChild(editBtn);
  ctrlDiv.appendChild(delBtn);
  li.appendChild(ctrlDiv);

  // Added date + reminder
  const topDiv = document.createElement("div");
  topDiv.className = "top";

  const addedOnDiv = document.createElement("div");
  addedOnDiv.style.display = "flex";

  const addedText = document.createElement("p");
  addedText.className = "added-on";
  addedText.textContent = "added on ";

  const addedDate = document.createElement("p");
  addedDate.textContent = new Date(li.dataset.created).toLocaleString();

  addedOnDiv.appendChild(addedText);
  addedOnDiv.appendChild(addedDate);

  const reminderTextDiv = document.createElement("div");
  reminderTextDiv.textContent = task.reminder
    ? `Reminder: ${new Date(task.reminder).toLocaleString()}`
    : "Reminder: Not set";

  topDiv.appendChild(addedOnDiv);
  topDiv.appendChild(reminderTextDiv);
  li.appendChild(topDiv);

  li.appendChild(document.createElement("hr"));

  // Task content
  const taskContent = document.createElement("p");
  taskContent.className = "todo-item-content";
  taskContent.innerHTML = task.text;
  taskContent.style.fontFamily = task.font;
  taskContent.style.fontSize = task.size;

  if (task.completed) {
    taskContent.style.textDecoration = "line-through";
    taskContent.style.color = "red";
    taskContent.style.opacity = "0.6";
  }

  li.appendChild(taskContent);

  // --- LOGIC: Copy Button ---
  copyBtn.onclick = () => {
    const textToCopy = taskContent.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
    });
  };

  // --- LOGIC: Edit Button ---
  editBtn.onclick = () => {
    // 1. Move content back to the main input
    taskInput.innerHTML = taskContent.innerHTML;
    
    // 2. Set the formatting inputs back to what they were
    fontSelect.value = task.font || "Arial";
    fontSizeInput.value = parseInt(task.size) || 18;
    reminderInput.value = task.reminder || "";

    // 3. Remove the current item and save
    li.remove();
    updateTaskIndexes();
    saveTasks();

    // 4. Focus the input so you can start typing
    taskInput.focus();
  };

  // Checkbox toggle
  checkbox.onclick = () => {
    checkbox.classList.toggle("checked");
    if (checkbox.classList.contains("checked")) {
      taskContent.style.textDecoration = "line-through";
      taskContent.style.color = "red";
      taskContent.style.opacity = "0.6";
    } else {
      taskContent.style.textDecoration = "none";
      taskContent.style.color = "";
      taskContent.style.opacity = "1";
    }
    saveTasks();
  };

  // Delete
  delBtn.onclick = () => {
    li.remove();
    updateTaskIndexes();
    saveTasks();
  };

  todoList.appendChild(li);
  updateTaskIndexes();
  if (save) saveTasks();

  if (task.reminder) {
    scheduleReminder(task.reminder, task.created, task.text);
  }
}
// -----------------------------------------
// REMINDER FUNCTIONS
// -----------------------------------------
function scheduleReminder(reminderTime, createdTime, text) {
  const reminderDate = new Date(reminderTime);
  const now = new Date();

  if (reminderDate > now) {
    const timeout = reminderDate.getTime() - now.getTime();
    setTimeout(() => showReminder(createdTime, text), timeout);
  }
}

function showReminder(createdTime, text) {
  reminderText.innerHTML = text;
  reminderDialog.classList.remove("hidden");

  const task = Array.from(todoList.children).find(
    t => t.dataset.created === createdTime
  );
  if (task) {
    task.dataset.reminder = "";
    saveTasks();
  }
}

closeReminder.onclick = () => reminderDialog.classList.add("hidden");

// -----------------------------------------
// TEXT FORMATTING
// -----------------------------------------
document.getElementById("boldBtn").onclick = () => document.execCommand("bold");
document.getElementById("italicBtn").onclick = () => document.execCommand("italic");
document.getElementById("underlineBtn").onclick = () => document.execCommand("underline");
document.getElementById("strikeBtn").onclick = () => document.execCommand("strikeThrough");

// -----------------------------------------
// LOAD SAVED TASKS (now uses wrapper)
// -----------------------------------------
storage.get("tasks", data => {
  if (data.tasks) data.tasks.forEach(t => createTask(t, false));
});

// -----------------------------------------
// ADD NEW TASK
// -----------------------------------------
addBtn.onclick = () => {
  const text = taskInput.innerHTML.trim();

  if (!text) {
    showCustomAlert("Please enter a task before adding!");
    return;
  }

  createTask(
    {
      text,
      completed: false,
      font: fontSelect.value,
      size: fontSizeInput.value + "px",
      reminder: reminderInput.value || null,
      created: new Date().toISOString()
    },
    true
  );

  taskInput.innerHTML = "";
  reminderInput.value = "";
};
