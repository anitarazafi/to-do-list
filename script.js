const newTaskInput = document.querySelector("#new-task-input");
const newTaskBtn = document.querySelector("#add-new-task");

const taskContainer = document.querySelector("#task-container");
const listContainer = document.querySelector(".list__container");

let clearAllBtn = null;

let tasks = [];

//Add task to the list
const appendMarkup = function (markup, parentElement) {
  parentElement.insertAdjacentHTML("afterbegin", markup);
};

//Store tasks to localStorage
const storeTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

//Get tasks from localStorage
const getTasks = function () {
  return localStorage.getItem("tasks");
};

//Check if task list is empty
const isTaskEmpty = function () {
  return !getTasks() ? true : false;
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

//Hide clear all button
const hideClearAllBtn = function () {
  const clearAllBtn = document.querySelector(".clear");
  if (!clearAllBtn) return;
  listContainer.removeChild(clearAllBtn);
};

//Show clear all button
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
  tasks.forEach((task) => {
    const markup = `
        <li class="list__item">
            <div class="list__item">
                <span class="list__item__text">${task}</span>
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

//Init
const init = function () {
  if (isTaskEmpty()) {
    showEmptyTaskMessage();
  } else {
    renderTasks();
    showClearAllBtn();
    clearAllBtn = document.querySelector(".clear");
    clearAllBtn.addEventListener("click", clearList);
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
  } else {
    showEmptyTaskMessage();
  }
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

//Clear list
const clearList = function () {
  localStorage.clear();
  taskContainer.innerHTML = "";
  showEmptyTaskMessage();
  hideClearAllBtn();
};
