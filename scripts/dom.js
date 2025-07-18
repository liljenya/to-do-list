import { Task } from './script.js';

document.addEventListener('DOMContentLoaded', () => {
    const addToDoBtn = document.querySelector('.add-todo');
    const mainContent = document.querySelector('.main-content');

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

        const priorityInput = document.createElement('input');
        priorityInput.type = 'checkbox';
        priorityInput.name = 'priority';

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
        form.appendChild(priorityInput);
        form.appendChild(submitBtn);
        form.appendChild(cancelBtn);
        modal.appendChild(form);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const task = new Task(titleInput.value, descriptionInput.value, dateInput.value, priorityInput.checked);
            addTaskToDOM(task);

            overlay.remove();
        });

        cancelBtn.addEventListener('click', () => {
            overlay.remove();
        });
    });

    function addTaskToDOM(task) {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('todo-item');
        taskDiv.style.marginTop = '20px';
        taskDiv.style.padding = '15px';
        taskDiv.style.border = '1px solid #ccc';
        taskDiv.style.borderRadius = '10px';
        taskDiv.style.background = '#fff';

        const circleColor = task.priority ? 'red' : 'green';

        taskDiv.innerHTML = `
        <div>
            <strong>${task.title}</strong><br>
            <p>${task.description}</p><br>
            <p>Виконати до: ${task.dueDate}</p>
        </div>
        <div style="width: 38px; height: 38px; border-radius: 50%; background: ${circleColor};"></div>
        `;

        mainContent.appendChild(taskDiv);
    }
});
