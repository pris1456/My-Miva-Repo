if (window.lucide) {
  lucide.createIcons();
}

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("show");
  });
}

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskCourse = document.getElementById("taskCourse");
const taskPriority = document.getElementById("taskPriority");
const taskDeadline = document.getElementById("taskDeadline");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const urgentTasks = document.getElementById("urgentTasks");

const filterButtons = document.querySelectorAll(".filter-btn");

const defaultTasks = [
  {
    id: 1,
    title: "Complete COS 106 portfolio website",
    course: "COS 106",
    priority: "High",
    deadline: "",
    completed: false
  },
  {
    id: 2,
    title: "Review cybersecurity lecture notes",
    course: "Cybersecurity",
    priority: "Medium",
    deadline: "",
    completed: false
  }
];

let tasks = loadTasks();
let currentFilter = "all";

function loadTasks() {
  const savedTasks = localStorage.getItem("samsonAdvancedTasks");

  if (savedTasks) {
    return JSON.parse(savedTasks);
  }

  return defaultTasks;
}

function saveTasks() {
  localStorage.setItem("samsonAdvancedTasks", JSON.stringify(tasks));
}

function getCountdown(deadline) {
  if (!deadline) return "No deadline set";

  const now = new Date();
  const end = new Date(deadline);
  const difference = end - now;

  if (difference <= 0) return "Deadline passed";

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
}

function isUrgent(task) {
  if (!task.deadline || task.completed) return false;

  const now = new Date();
  const end = new Date(task.deadline);
  const difference = end - now;

  return difference > 0 && difference <= 1000 * 60 * 60 * 24;
}

function getFilteredTasks() {
  if (currentFilter === "completed") {
    return tasks.filter(function (task) {
      return task.completed;
    });
  }

  if (currentFilter === "pending") {
    return tasks.filter(function (task) {
      return !task.completed;
    });
  }

  return tasks;
}

function renderTasks() {
  if (!taskList) return;

  taskList.innerHTML = "";

  const filteredTasks = getFilteredTasks();

  if (filteredTasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-task";
    emptyItem.textContent = "No tasks in this view yet.";
    taskList.appendChild(emptyItem);
    updateTaskStats();
    return;
  }

  filteredTasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = task.completed ? "task-item completed" : "task-item";

    const completeButton = document.createElement("button");
    completeButton.className = "task-check";
    completeButton.textContent = task.completed ? "✓" : "";
    completeButton.setAttribute("aria-label", "Toggle task completed");

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const course = document.createElement("span");
    course.textContent = task.course || "General";

    const priority = document.createElement("span");
    priority.className = `priority ${task.priority.toLowerCase()}`;
    priority.textContent = task.priority;

    const countdown = document.createElement("span");
    countdown.className = getCountdown(task.deadline) === "Deadline passed" ? "countdown overdue" : "countdown";
    countdown.textContent = getCountdown(task.deadline);

    meta.appendChild(course);
    meta.appendChild(priority);
    meta.appendChild(countdown);

    content.appendChild(title);
    content.appendChild(meta);

    const deleteButton = document.createElement("button");
    deleteButton.className = "task-delete";
    deleteButton.textContent = "Delete";

    completeButton.addEventListener("click", function () {
      toggleTask(task.id);
    });

    deleteButton.addEventListener("click", function () {
      deleteTask(task.id);
    });

    li.appendChild(completeButton);
    li.appendChild(content);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });

  updateTaskStats();

  if (window.lucide) {
    lucide.createIcons();
  }
}

function addTask(title, course, priority, deadline) {
  const task = {
    id: Date.now(),
    title: title,
    course: course || "General",
    priority: priority,
    deadline: deadline,
    completed: false
  };

  tasks.unshift(task);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed
      };
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });

  saveTasks();
  renderTasks();
}

function updateTaskStats() {
  if (!totalTasks) return;

  const completed = tasks.filter(function (task) {
    return task.completed;
  }).length;

  const urgent = tasks.filter(isUrgent).length;

  totalTasks.textContent = tasks.length;
  completedTasks.textContent = completed;
  pendingTasks.textContent = tasks.length - completed;
  urgentTasks.textContent = urgent;
}

if (taskForm) {
  taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
      taskMessage.textContent = "Please enter a task title.";
      return;
    }

    addTask(
      title,
      taskCourse.value.trim(),
      taskPriority.value,
      taskDeadline.value
    );

    taskForm.reset();
    taskPriority.value = "Medium";
    taskMessage.textContent = "Task added successfully.";
  });

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      filterButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");
      currentFilter = button.dataset.filter;
      renderTasks();
    });
  });

  renderTasks();
  setInterval(renderTasks, 60000);
}

const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

function setFieldError(input, message) {
  const field = input.parentElement;
  const small = field.querySelector("small");

  field.className = "field error";
  small.textContent = message;
}

function setFieldSuccess(input) {
  const field = input.parentElement;
  const small = field.querySelector("small");

  field.className = "field success";
  small.textContent = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isDigitsOnly(phone) {
  return /^[0-9]+$/.test(phone);
}

function validateRequiredText(input, message) {
  if (input.value.trim() === "") {
    setFieldError(input, message);
    return false;
  }

  setFieldSuccess(input);
  return true;
}

if (contactForm) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    let isValid = true;

    if (!validateRequiredText(name, "Name is required.")) isValid = false;

    if (email.value.trim() === "") {
      setFieldError(email, "Email address is required.");
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      setFieldError(email, "Please enter a valid email address.");
      isValid = false;
    } else {
      setFieldSuccess(email);
    }

    if (phone.value.trim() === "") {
      setFieldError(phone, "Phone number is required.");
      isValid = false;
    } else if (!isDigitsOnly(phone.value.trim())) {
      setFieldError(phone, "Phone number must contain only digits.");
      isValid = false;
    } else {
      setFieldSuccess(phone);
    }

    if (!validateRequiredText(subject, "Subject is required.")) isValid = false;
    if (!validateRequiredText(message, "Message is required.")) isValid = false;

    if (isValid) {
      formSuccess.textContent = "Your message has been validated successfully.";
      contactForm.reset();

      contactForm.querySelectorAll(".field").forEach(function (field) {
        field.className = "field";
      });
    } else {
      formSuccess.textContent = "";
    }
  });
}