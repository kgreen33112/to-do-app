import './style.css';

// Storage
function saveToLocalStorage() {
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("currentProject", currentProject);
  }
  
  function loadFromLocalStorage() {
    const storedProjects = localStorage.getItem("projects");
    const storedCurrent = localStorage.getItem("currentProject");
    
    if (storedProjects) {
      Object.assign(projects, JSON.parse(storedProjects));
    }
    
    if (storedCurrent && projects[storedCurrent]) {
      currentProject = storedCurrent;
    } 
  }
  
  // Constants
  const addBtn = document.querySelector(".add-task");
  
  const popupOverlay = document.getElementById("popupOverlay");
  
  const cancelBtn = document.getElementById("cancelBtn");
  
  const taskForm = document.getElementById("taskForm");
  
  const taskList = document.getElementById("taskList");
  
  const prioritySelect = document.getElementById("priority");
  
  document.querySelector(".tasks").addEventListener("click", (e) => {
    if (e.target.closest(".delete-btn")) {
      const taskItem = e.target.closest(".task");
      if (taskItem) taskItem.remove();
    }
  });
  
  // Placeholder Tasks
  const placeholderTasks = [
    {
      title: "Finish app project",
      description: "Complete web app",
      dueDate: "2025-08-10",
      priority: "medium",
    },
    {
      title: "Lesson planning",
      description: "Escape room camp W-F plan",
      dueDate: "2025-08-05",
      priority: "high",
    },
  ];
  if (taskList) {
    placeholderTasks.forEach((task, index) => {
      const taskItem = document.createElement("div");
      taskItem.classList.add("task");
      taskItem.innerHTML = `
      <div class="checklist">
        <div class="info">
          <input class="checkbox" type="checkbox" id="task-${index + 1}">
          <label class="label priority ${task.priority}" for="task-${index + 1}">
          ${task.title}
          </label>
        <div class="meta">
          <div class="description">${task.description}</div>
          <div class="due-date">${task.dueDate}</div>
        </div>
      </div>
      <div class="edit">
        <button class="icon-button delete-btn" title="Delete">
        <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
   `;
      taskList.appendChild(taskItem);
    });
  }
  
  // Open popup
  addBtn.addEventListener("click", () => {
    popupOverlay.style.display="flex";
  });
  
  // Cancel popup
  cancelBtn.addEventListener("click", () => {
    popupOverlay.style.display="none";
  });
  
  // Priority color change
  prioritySelect.addEventListener("change", () => {
    const value = prioritySelect.value;
    prioritySelect.style.color = value === "low" ? "green" : value === "medium" ? "orange" : "red";
  });
  prioritySelect.dispatchEvent(new Event("change"));
  
  // Handle form submission
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const dueDateInput = document.getElementById("dueDate");
    const title = titleInput.value;
    const description = descriptionInput.value;
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value;
    
    const newTask = {
      title: titleInput.value,
      description: descriptionInput.value,
      dueDate: dueDateInput.value,
      priority: prioritySelect.value,
    };
    if (!projects[currentProject]) {
      projects[currentProject] = [];
    }
    projects[currentProject].push(newTask);
    if (!title) return;
    const task = document.createElement("div");
    task.classList.add("task");
    
    const id = `task-${Date.now()}`;
    task.innerHTML = `
      <div class="checklist">
        <div class="info">
          <input class="checkbox" type="checkbox" id="${id}">
          <label class="label priority ${priority}" for="${id}">${title}</label>
          <div class="meta">
          ${
    description ? `<div class="description">
    ${description}</div>` 
    : ""
  }
    ${dueDate ? `<div class="due-date">Due: ${dueDate}</div>` : ""} 
    </div>
   </div>
   <div class="edit">
   <button class="icon-button delete-btn" title="Delete">
   <i class="fa-solid fa-trash"></i>
   </button>
   </div>
   </div>
   `;
    
    taskList.appendChild(task);
    taskForm.reset();
    popupOverlay.style.display="none";
  });
  
  const projectList = document.querySelector(".projects");
  const createProjectBtn = document.getElementById("createProject");
  
  // Create project popup
  const projectPopup = document.createElement("div");
  
  projectPopup.className = "popup-overlay";
  projectPopup.style.display = "none";
  
  projectPopup.innerHTML = `
    <div class="popup">
      <h2>New Project</h2>
      <form id="projectForm">
        <label for="projectTitle">*Project Title:
        </label>
        <input type="text" id="projectTitle" required />
        <div class="form-buttons">
        <button type="submit" class="submit-btn">Add Project</button>
        <button type="button" id="cancelProjectBtn">Cancel</button>
        </div>
        </form>
    </div>
    `;
  
  document.body.appendChild(projectPopup);
  
  const projects = {
    Apogee: [...placeholderTasks],
    Work: [
      {
        title: "Lesson plan fall",
        description: "Adapt/modify for 5-7",
        dueDate: "2025-08-31",
        priority: "medium",
      },
      {
        title: "Create work schedule",
        description: "Block time for work/Apogee",
        dueDate: "2025-08-05",
        priority: "high",
      },
    ],
  };
  let currentProject = "Apogee";
  
  function renderProjects() {
    projectList.innerHTML = "";
    for (const name in projects) {
      const projectE1 = document.createElement("div");
      projectE1.classList.add("project");
      projectE1.innerHTML = `<button class="project-btn">${name}</button>`;
      projectE1.addEventListener("click", () => {
        currentProject = name;
        saveToLocalStorage();
       document.querySelector(".project-name").textContent = name;
        loadFromLocalStorage();
        renderTasks();
      });
      projectList.appendChild(projectE1);
    }
  }
  
  function renderTasks() {
    taskList.innerHTML = "";
    const tasks = projects[currentProject];
    tasks.forEach((task, index) => {
      const id = `task-${Date.now()}-${index}`;
      const taskItem = document.createElement("div");
      taskItem.classList.add("task");
   
      taskItem.innerHTML = `
      <div class="checklist">
        <div class="info">
          <input class="checkbox" type="checkbox" id="${id}">
          <label class="label priority ${task.priority}" for="${id}">${task.title
    }</label>
        <div class="meta">
          ${
      task.description 
        ? `<div class="description">${task.description}</div>`
      : ""
    }
    ${
      task.dueDate
        ? `<div class="due-date">Due: ${task.dueDate}</div>`
      : ""
    }
   </div>
  </div>
  <div class="edit">
    <button class="icon-button delete-btn" title="Delete"><i class="fa-solid fa-trash"></i>
    </button>
   </div>
  </div>
  `;
    taskList.appendChild(taskItem);
   });
  }
  
  taskList.addEventListener("click", (e) => {
    if (e.target.closest(".delete-btn")) {
      const taskE1 = e.target.closest(".task");
      const label = taskE1.querySelector("label")?.textContent.trim();
      projects[currentProject] = projects[currentProject].filter((t) => t.title !== label);
      saveToLocalStorage();
      loadFromLocalStorage();
      renderTasks();
    }
  });
  
  // Add task with project-specific context
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const priority = prioritySelect.value;
    
    if(!title) return;
    
    projects[currentProject].push({ title, description, dueDate, priority });
    saveToLocalStorage();
    taskForm.reset();
    popupOverlay.style.display = "none";
    loadFromLocalStorage();
    renderTasks();
  });
  
  // Project Popup Logic
  createProjectBtn.addEventListener("click", () => {
    projectPopup.style.display = "flex";
  });
  projectPopup.addEventListener("click", (e) => {
    if (e.target === projectPopup || e.target.id === "cancelProjectBtn") {
      projectPopup.style.display = "none";
    }
  });
  
  document.getElementById("projectForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newTitle = document.getElementById("projectTitle").value.trim();
    if(!newTitle || projects[newTitle]) return;
    
    projects[newTitle] = [];
    currentProject = newTitle;
    saveToLocalStorage();
    document.querySelector(".project-name").textContent = newTitle;
    loadFromLocalStorage();
    renderProjects();
    renderTasks();
    projectPopup.style.display = "none";
  });
  
  loadFromLocalStorage();
  renderProjects();
  renderTasks();
  document.querySelector(".project-name").textContent = currentProject;
  
  const deleteProjectBtn = document.getElementById("deleteProject");
  deleteProjectBtn.addEventListener("click", () => {
    if (Object.keys(projects).length <= 1) {
      alert("Add your first project to start working!");
      return;
    }
    
    const confirmDelete = confirm(`Are you sure you want to delete "${currentProject}"?`);
    
    if(!confirmDelete) return;
    
    delete projects[currentProject];
    
    // Set fallback to first remaining project
    currentProject = Object.keys(projects)[0];
    saveToLocalStorage();
    document.querySelector(".project-name").textContent = currentProject;
    loadFromLocalStorage();
    renderProjects();
    renderTasks();
  });