const STORAGE_KEY = 'todo_greyteal_v1';
const addBtn = document.getElementById('add-task-btn');
const taskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input'); 

function loadTasks(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return [];
    try { return JSON.parse(raw); } catch(e){ console.warn(e); return []; }
}
function saveTasks(tasks){ localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }

function escapeHtml(s){ return s.replace(/[&<>"']/g, (m)=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function renderTasks(tasks){
    taskList.innerHTML = '';
    tasks.forEach((t, idx) => {
        const li = document.createElement('li');
        li.className = 'task-item';

        const left = document.createElement('div');
        left.className = 'text';
        left.innerHTML = `<i class="fa fa-list" aria-hidden="true"></i><span>${escapeHtml(t.text)}</span>`;

        const btns = document.createElement('div');
        btns.className = 'task-actions';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.setAttribute('aria-label','Remove task');
        removeBtn.innerHTML = '<i class="fa fa-times"></i>';
        removeBtn.addEventListener('click', () => {
            if(!confirm('Delete this task?')) return;
            const arr = loadTasks();
            arr.splice(idx,1); 
            saveTasks(arr);
            
            searchTasks(true);
        });

        btns.appendChild(removeBtn);
        li.appendChild(left);
        li.appendChild(btns);
        taskList.appendChild(li);
    });
}

function addTaskFromInput(){
    const text = taskInput.value.trim();
    if(!text) return;
    const tasks = loadTasks();
    tasks.push({ text: text, createdAt: Date.now() });
    saveTasks(tasks);
    renderTasks(tasks);
    taskInput.value = '';
    taskInput.focus();
}

/**
 * Searches and renders tasks based on the value in searchInput.
 * @param {boolean} isInternalCall - Flag to prevent alert on internal re-renders.
 */
function searchTasks(isInternalCall = false){
    const q = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const tasks = loadTasks();
    if(!q){ renderTasks(tasks); return; }

    const filtered = tasks.filter(t => t.text.toLowerCase().includes(q));

    if(!isInternalCall && filtered.length === 0) {
        alert('No matching tasks found.');
    }

    renderTasks(filtered);
}


addBtn && addBtn.addEventListener('click', addTaskFromInput);
taskInput && taskInput.addEventListener('keydown', (e)=> { if(e.key === 'Enter'){ addTaskFromInput(); e.preventDefault(); }});


searchBtn && searchBtn.addEventListener('click', () => { searchTasks(); });
searchInput && searchInput.addEventListener('keydown', (e)=> { if(e.key === 'Enter'){ searchTasks(); e.preventDefault(); }});

document.addEventListener('DOMContentLoaded', ()=> { renderTasks(loadTasks()); });