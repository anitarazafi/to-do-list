//TODO: ADD CONFIRMATION WINDOW BEFORE DELETING A TASK

const newTaskInput = document.querySelector("#new-task-input");
const newTaskBtn = document.querySelector("#add-new-task");

const taskContainer = document.querySelector("#task-container");
const listContainer = document.querySelector(".list__container");

let clearAllBtn = null;
let tasks = [];
let taskDone = [];

//Append task to the list
const appendMarkup = function (markup, parentElement) {
  parentElement.insertAdjacentHTML("afterbegin", markup);
};

//Store tasks to localStorage
const storeTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("taskDone", JSON.stringify(taskDone));
};

//Get tasks from localStorage
const getTasks = function () {
  return localStorage.getItem("tasks");
};
const getTasksDone = function () {
  return localStorage.getItem("taskDone");
};

//Check if task list is empty
const isTaskEmpty = function () {
  return !getTasks() ? true : false;
};

//Check if a task is done
const isDone = function (task) {
  return taskDone.includes(task);
};

//Show empty task message
const showEmptyTaskMessage = function () {
  const markup = `
        <div class="message">
            Start adding tasks to your to-do list :D
        </div>
    `;
  appendMarkup(markup, listContainer);
};

//Hide empty task message
const hideEmptyTaskMessage = function () {
  const message = document.querySelector(".message");
  if (!message) return;
  listContainer.removeChild(message);
};

//Hide clearAll button
const hideClearAllBtn = function () {
  const clearAllBtn = document.querySelector(".clear");
  if (!clearAllBtn) return;
  listContainer.removeChild(clearAllBtn);
};

//Show clearAll button
const showClearAllBtn = function () {
  hideClearAllBtn();
  const markup = `
    <button class="btn clear">Clear all</button>
    `;
  appendMarkup(markup, listContainer);
};

//Render tasks
const renderTasks = function () {
  tasks = JSON.parse(getTasks());
  taskDone = JSON.parse(getTasksDone());
  tasks.forEach((task) => {
    const markup = `
        <li class="list__item">
            <div class="list__item">
                <span class="list__item__text ${
                  isDone(task) ? "done" : ""
                }">${task}</span>
                <span class="list__item__action">
                    <button class="btn action mark-as-done ${
                      isDone(task) ? "undo" : ""
                    }">
                    <i class="fa-solid fa-check"></i>
                    </button>
                    <button class="btn action edit">
                    <i class="fa-solid fa-pen"></i>
                    </button>
                    <button class="btn action delete">
                    <i class="fa-solid fa-trash"></i>
                    </button>
                </span>
            </div>
        </li>
        `;
    appendMarkup(markup, taskContainer);
  });
};

//Add new task to the list
const addTaskToList = function (newTask) {
  const markup = `
    <li class="list__item">
        <div class="list__item">
            <span class="list__item__text">${newTask}</span>
            <span class="list__item__action">
                <button class="btn action mark-as-done">
                <i class="fa-solid fa-check"></i>
                </button>
                <button class="btn action edit">
                <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn action delete">
                <i class="fa-solid fa-trash"></i>
                </button>
            </span>
        </div>
    </li>
    `;
  appendMarkup(markup, taskContainer);
};

//Clear all list items
const clearList = function () {
  localStorage.clear();
  tasks = [];
  taskContainer.innerHTML = "";
  showEmptyTaskMessage();
  hideClearAllBtn();
};

//Delete a task
const deleteTask = function (e) {
  const item = e.target.closest("li.list__item");
  item.remove();
  tasks.splice(tasks.indexOf(item), 1);
  storeTasks();
  updateTaskList();
  if (tasks.length === 0) {
    clearList();
  }
};

//Remove from taskDone
const undoTask = function (task) {
  taskDone.splice(taskDone.indexOf(task), 1);
  storeTasks();
  updateTaskList();
};

//Show edit input
const showEditInput = function (e) {
  const item = e.target.closest("li.list__item");
  const oldValue = item.querySelector(".list__item__text").textContent;
  const taskIndex = tasks.indexOf(oldValue);

  item.innerHTML = `
    <div class="list__item">
      <input
        type="text"
        class="list__item__edit"
        value = "${oldValue}"
      />
      <button class="btn save">Save</button>
    </div>
    `;

  //Get new value
  const getNewValue = function (e) {
    const newValue = e.target
      .closest(".list__item")
      .querySelector("input").value;
    return newValue;
  };

  //Save edited task
  const save = function (e) {
    tasks[taskIndex] = getNewValue(e);
    storeTasks();
    item.innerHTML = `
        <div class="list__item">
            <span class="list__item__text">${tasks[taskIndex]}</span>
            <span class="list__item__action">
                <button class="btn action mark-as-done">
                <i class="fa-solid fa-check"></i>
                </button>
                <button class="btn action edit">
                <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn action delete">
                <i class="fa-solid fa-trash"></i>
                </button>
            </span>
        </div>
    `;
    updateTaskList();
    undoTask(oldValue);
  };

  const saveBtn = item.querySelector(".save");
  saveBtn.addEventListener("click", save);

  const editInput = document.querySelector(".list__item__edit");
  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      save(e);
    }
  });
};

//Edit task
const editTask = function (e) {
  showEditInput(e);
};

//Mark as read
const toggleCheck = function (e) {
  const taskDone = e.target
    .closest("li.list__item")
    .querySelector(".list__item__text");
  taskDone.classList.toggle("done");
  const checkedBtn = e.target.closest(".btn");
  checkedBtn.classList.toggle("undo");
  const task = taskDone.textContent;
  if (taskDone.classList.contains("done")) {
    addFinishedTask(task);
  } else {
    undoTask(task);
  }
};

//Add event listeners to actions
const addActions = function () {
  const deleteTaskBtn = document.querySelectorAll(".delete");
  deleteTaskBtn.forEach((del) => {
    del.addEventListener("click", deleteTask);
  });

  const editTaskBtn = document.querySelectorAll(".edit");
  editTaskBtn.forEach((edit) => {
    edit.addEventListener("click", editTask);
  });

  const checkBtn = document.querySelectorAll(".mark-as-done");
  checkBtn.forEach((check) => {
    check.addEventListener("click", toggleCheck);
  });
};

//Init
const init = function () {
  if (isTaskEmpty()) {
    showEmptyTaskMessage();
  } else {
    renderTasks();
    showClearAllBtn();
    clearAllBtn = document.querySelector(".clear");
    clearAllBtn.addEventListener("click", clearList);
    addActions();
  }
};
init();

//Update tasks list
const updateTaskList = function () {
  if (!isTaskEmpty()) {
    hideEmptyTaskMessage();
    showClearAllBtn();
    clearAllBtn = document.querySelector(".clear");
    clearAllBtn.addEventListener("click", clearList);
    addActions();
  } else {
    showEmptyTaskMessage();
  }
};

//Add to taskDone
const addFinishedTask = function (task) {
  taskDone.push(task);
  storeTasks();
  updateTaskList();
};

//Add new task
const addNewTask = function () {
  const newTask = newTaskInput.value;
  if (newTask === "") return;
  tasks.push(newTask);
  storeTasks();
  addTaskToList(newTask);
  updateTaskList();
  newTaskInput.value = "";
};

//Add new task event listener
newTaskBtn.addEventListener("click", addNewTask);
newTaskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addNewTask();
  }
});
