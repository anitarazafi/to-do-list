//TODO: ADD EDIT FUNCTION AND EVENT LISTENER
//TODO: SAVE THE STATE OF A TASK : DONE OR NOT
//TODO: FIX CLEARALL ISSUE

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

//Clear all list
const clearList = function () {
  localStorage.clear();
  tasks = [];
  taskContainer.innerHTML = "";
  showEmptyTaskMessage();
  hideClearAllBtn();
};

//Delete a task
//TODO: REMOVE THE CLEARALL BTN WHEN THE LAST TASK DELETED MANUALLY
const deleteTask = function (e) {
  const item = e.target.closest("li.list__item");
  console.log(item);
  item.remove();
  const itemValue = item.querySelector(".list__item__text").textContent;
  tasks.splice(tasks.indexOf(item), 1);
  storeTasks();
  updateTaskList();
};

//Mark as read
const toggleCheck = function (e) {
  e.target
    .closest("li.list__item")
    .querySelector(".list__item__text")
    .classList.toggle("done");
  e.target.closest(".btn").classList.toggle("undo");
};

//Add event listeners to actions
const addActions = function () {
  const deleteTaskBtn = document.querySelectorAll(".delete");
  deleteTaskBtn.forEach((del) => {
    del.addEventListener("click", deleteTask);
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
