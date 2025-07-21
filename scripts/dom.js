import { Task } from './script.js';

let projects = JSON.parse(localStorage.getItem('projects')) || {
    Default: []
};

function saveProjectsToStorage() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

document.addEventListener('DOMContentLoaded', () => {
    const addToDoBtn = document.querySelector('.add-todo');
    const mainContent = document.querySelector('.main-content');

    let projectList = document.querySelector('.project-list');
    if (!projectList) {
        projectList = document.createElement('div');
        projectList.classList.add('project-list');
        mainContent.parentNode.insertBefore(projectList);
    }

    function updateProjectList() {
        projectList.innerHTML = '';

        for (let projectName in projects) {
            const count = projects[projectName].length;
            const projectItem = document.createElement('div');
            projectItem.textContent = `${projectName} (${count})`;
            projectItem.style.padding = '6px 10px';
            projectItem.style.cursor = 'default';
            projectItem.style.fontWeight = '600';
            projectItem.style.borderBottom = '1px solid #ddd';

            projectList.appendChild(projectItem);
        }
    }

    for (let projectName in projects) {
        projects[projectName].forEach(task => {
            addTaskToDOM(task, projectName);
        });
    }

    updateProjectList();

    addToDoBtn.addEventListener('click', () => {
        if (document.querySelector('.modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');

        const modal = document.createElement('div');
        modal.classList.add('modal');

        const form = document.createElement('form');
        form.classList.add('todo-form');

        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.name = 'title';
        titleInput.placeholder = 'Task name is...';
        titleInput.required = true;

        const descriptionInput = document.createElement('input');
        descriptionInput.type = 'text';
        descriptionInput.name = 'description';
        descriptionInput.placeholder = 'Task description is...';
        descriptionInput.required = true;

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.name = 'dueDate';
        dateInput.required = true;

        const priorityLabel = document.createElement('label');
        priorityLabel.style.display = 'flex';
        priorityLabel.style.alignItems = 'center';
        priorityLabel.style.gap = '10px';
        priorityLabel.style.margin = '10px 0';

        const priorityInput = document.createElement('input');
        priorityInput.type = 'checkbox';
        priorityInput.name = 'priority';

        const priorityText = document.createElement('span');
        priorityText.textContent = 'Is this an urgent task?';

        priorityLabel.appendChild(priorityInput);
        priorityLabel.appendChild(priorityText);

        const projectGroup = document.createElement('div');
        projectGroup.classList.add('project-select-group');

        const projectLabel = document.createElement('label');
        projectLabel.textContent = 'Choose project:';
        projectLabel.style.fontWeight = 'bold';

        const projectSelect = document.createElement('select');
        projectSelect.name = 'project';
        projectSelect.required = true;
        projectSelect.style.padding = '8px';
        projectSelect.style.borderRadius = '6px';
        projectSelect.style.border = '1px solid #ccc';

        function updateProjectOptions() {
            projectSelect.innerHTML = '';
            for (let key in projects) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = key;
                projectSelect.appendChild(option);
            }
        }
        updateProjectOptions();

        const newProjectBtn = document.createElement('button');
        newProjectBtn.type = 'button';
        newProjectBtn.textContent = 'Create New Project';
        newProjectBtn.style.padding = '6px 10px';
        newProjectBtn.style.borderRadius = '5px';
        newProjectBtn.style.backgroundColor = '#007bff';
        newProjectBtn.style.color = '#fff';
        newProjectBtn.style.border = 'none';
        newProjectBtn.style.cursor = 'pointer';
        newProjectBtn.style.width = 'fit-content';

        newProjectBtn.addEventListener('click', () => {
            const newProjectName = prompt('Enter new project name:');
            if (newProjectName && !projects[newProjectName]) {
                projects[newProjectName] = [];
                saveProjectsToStorage(); 
                updateProjectOptions();
                projectSelect.value = newProjectName;
                updateProjectList();
            } else {
                alert('Project exists or name is invalid');
            }
        });

        projectGroup.appendChild(projectLabel);
        projectGroup.appendChild(projectSelect);
        projectGroup.appendChild(newProjectBtn);

        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Add';

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.style.marginLeft = '10px';

        form.appendChild(titleInput);
        form.appendChild(descriptionInput);
        form.appendChild(dateInput);
        form.appendChild(priorityLabel);
        form.appendChild(projectGroup);
        form.appendChild(submitBtn);
        form.appendChild(cancelBtn);

        modal.appendChild(form);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const task = new Task(titleInput.value, descriptionInput.value, dateInput.value, priorityInput.checked);
            const selectedProject = projectSelect.value;
            projects[selectedProject].push(task);

            saveProjectsToStorage(); 
            addTaskToDOM(task, selectedProject);
            updateProjectList();
            overlay.remove();
        });

        cancelBtn.addEventListener('click', () => {
            overlay.remove();
        });
    });

    function addTaskToDOM(task, projectName) {
        let projectSection = document.querySelector(`[data-project="${projectName}"]`);

        if (!projectSection) {
            projectSection = document.createElement('div');
            projectSection.dataset.project = projectName;
            projectSection.style.marginTop = '30px';

            const header = document.createElement('h2');
            header.textContent = projectName;
            header.style.marginBottom = '15px';

            projectSection.appendChild(header);
            mainContent.appendChild(projectSection);
        }

        const taskDiv = document.createElement('div');
        taskDiv.classList.add('todo-item');

        const circleColor = task.priority ? 'red' : 'green';

        taskDiv.innerHTML = `
        <div>
            <strong>${task.title}</strong><br>
            <p>${task.description}</p><br>
            <p>Виконати до: ${task.dueDate}</p>
            <button class="delete-button">Delete</button>
        </div>
        <div style="width: 38px; height: 38px; border-radius: 50%; background: ${circleColor};"></div>
        `;

        const deleteBtn = taskDiv.querySelector('.delete-button');
        deleteBtn.addEventListener('click', () => {
            taskDiv.remove();

            const projectTasks = projects[projectName];
            const index = projectTasks.findIndex(t => t.title === task.title && t.dueDate === task.dueDate);
            if (index > -1) {
                projectTasks.splice(index, 1);
                saveProjectsToStorage(); 
            }
            updateProjectList();
        });

        projectSection.appendChild(taskDiv);
    }
});
