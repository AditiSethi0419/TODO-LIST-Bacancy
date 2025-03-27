document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    renderTasks();

    addTaskButton.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            addTask();
        }
    });

    function addTask() {
        let taskText = taskInput.value.trim();

        if (taskText === "") {
            alert("Please enter a task.");
            return;
        }

        // Capitalize first letter
        taskText = taskText.charAt(0).toUpperCase() + taskText.slice(1).toLowerCase();

        if (tasks.some(task => task.text === taskText)) {
            alert("Task already exists.");
            return;
        }

        const task = { text: taskText, completed: false };
        tasks.push(task);
        saveTasks();
        renderTasks();

        taskInput.value = "";
    }

    function renderTasks() {
        taskList.innerHTML = "";
        taskList.style.display = tasks.length > 0 ? "block" : "none";

        tasks.forEach((task, index) => {
            const taskItem = document.createElement("div");
            taskItem.className = "task-item";
            const taskContent = document.createElement("div");
            taskContent.className = "task-content";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.addEventListener("change", function () {
                tasks[index].completed = this.checked;
                saveTasks();
                updateTaskStyle(taskText, this.checked);
            });

            const taskText = document.createElement("span");
            taskText.textContent = task.text;
            if (task.completed) {
                taskText.classList.add("completed-text"); // Apply strikethrough only if completed
            }

            taskContent.appendChild(checkbox);
            taskContent.appendChild(taskText);

            // Actions (edit and delete buttons)
            const taskActions = document.createElement("div");
            taskActions.className = "task-actions";

            
            const editButton = document.createElement("button");
            editButton.textContent = "✏️";
            editButton.className = "edit-btn";
            editButton.addEventListener("click", function () {
                editTask(index);
            });

            
            const deleteButton = document.createElement("button");
            deleteButton.innerHTML = "❌";
            deleteButton.className = "delete-btn";
            deleteButton.addEventListener("click", function () {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);

            // Append both divs to task item
            taskItem.appendChild(taskContent);
            taskItem.appendChild(taskActions);

            // Add to task list
            taskList.appendChild(taskItem);
            updateTaskStyle(taskText, task.completed);
        });
    }

    function editTask(index) {
        const newTask = prompt("Edit your task:", tasks[index].text);
        if (newTask !== null && newTask.trim() !== "") {
            tasks[index].text = newTask.charAt(0).toUpperCase() + newTask.slice(1).toLowerCase();
            saveTasks();
            renderTasks();
        }
    }

    function updateTaskStyle(taskText, completed) {
        if (completed) {
            taskText.classList.add("completed-text"); // Add strikethrough effect
        } else {
            taskText.classList.remove("completed-text"); // Remove strikethrough effect
        }
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});
