document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const taskTable = document.getElementById("taskTable").getElementsByTagName("tbody")[0];
    const totalProgress = document.getElementById("totalProgress");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        taskTable.innerHTML = "";
        tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Ordenar por fecha
        tasks.forEach((task, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="${task.completed ? 'completed' : ''}">${task.name}</td>
                <td>${task.registrationDate}</td>
                <td>${task.dueDate}</td>
                <td><input type="number" value="${task.progress}" min="0" max="100" onchange="updateProgress(${index}, this.value)"></td>
                <td><input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleCompleted(${index})"></td>
                <td><button onclick="deleteTask(${index})">Eliminar</button></td>
            `;
            taskTable.appendChild(row);
        });
        updateTotalProgress();
    }

    function addTask(name, dueDate) {
        const task = {
            name,
            registrationDate: new Date().toLocaleDateString(),
            dueDate,
            progress: 0,
            completed: false
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
    }

    function updateProgress(index, progress) {
        tasks[index].progress = parseInt(progress);
        saveTasks();
        renderTasks();
    }

    function toggleCompleted(index) {
        tasks[index].completed = !tasks[index].completed;
        if (tasks[index].completed) {
            tasks.push(tasks.splice(index, 1)[0]); // Mover al final
        }
        saveTasks();
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    }

    function updateTotalProgress() {
        const total = tasks.reduce((sum, task) => sum + task.progress, 0);
        const average = tasks.length > 0 ? (total / tasks.length).toFixed(2) : 0;
        totalProgress.textContent = `${average}%`;
    }

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const taskName = document.getElementById("taskName").value;
        const dueDate = document.getElementById("dueDate").value;
        addTask(taskName, dueDate);
        taskForm.reset();
    });

    window.updateProgress = updateProgress;
    window.toggleCompleted = toggleCompleted;
    window.deleteTask = deleteTask;

    renderTasks();
});