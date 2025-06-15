// setTimeout(function(){
//     window.location.reload();
// }, 1000);


let todos = localStorage.getItem('todoList');
if (todos) todos = todos.split(",");
else todos = [];


const todo_list = document.getElementById("todo_list");
const todo_add = document.getElementById("todo_add");

const todoItemRCMenu = document.getElementById("todoItemRCMenu");

let currentTodoItem = null;

const todoItemRCMenuItems = todoItemRCMenu.querySelectorAll('li');
const editItem = todoItemRCMenuItems[0];
const deleteItem = todoItemRCMenuItems[1];



todo_add.addEventListener("keyup", todoAdd);
editItem.addEventListener('click', function() {
    if (currentTodoItem) {
        editTodo(currentTodoItem); // Call editTodo with the stored item
    }
    resetRCMenu();
});

deleteItem.addEventListener('click', function() {
    if (currentTodoItem) {
        todoDel(currentTodoItem); // Call todoDel with the stored item
    }
    resetRCMenu();
});

renderTodos()



// const customRCMenu = document.getElementById('customRCMenu');

// ask_bar.addEventListener('contextmenu', function (e) {
//     renderRCMenu(e, customRCMenu);
// });









function todoAdd(event) {
    if (event.key === 'Enter' && todo_add.value != "") {
        todos.push(todo_add.value);
        newTodo(todo_add.value);
        todo_add.value = ""
        localStorage.setItem("todoList", todos);
    }
}

function newTodo(text) {
    let li = document.createElement("li");
    li.innerHTML = text;
    li.addEventListener("contextmenu", todoRclick);
    li.addEventListener("dblclick", function(e) { // Use a function wrapper to pass e.target
        todoDel(e.target);
    });
    todo_list.appendChild(li);
}

function renderTodos() {
    todo_list.innerHTML = "";
    for (let todo of todos) {
        newTodo(todo);
    }
}

function todoDel(itemToDelete) {
    todos = todos.filter(item => item != itemToDelete.innerHTML);
    itemToDelete.remove();
    localStorage.setItem("todoList", todos);
}

function todoRclick(e) {
    currentTodoItem = e.target;
    renderRCMenu(e, todoItemRCMenu);
}

function editTodo(itemToEdit) {
    const originalText = itemToEdit.innerHTML;
    const input = document.createElement('input');

    input.type = 'text';
    input.value = originalText;
    input.id = "todoEdit";

    itemToEdit.parentNode.replaceChild(input, itemToEdit);

    input.focus();

    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            saveEdit(input, originalText);
        }
    });

}

function saveEdit(inputElement, originalText) {
    const newText = inputElement.value.trim();

    const index = todos.indexOf(originalText);

    if (newText !== "" && index !== -1) {
        todos[index] = newText;
        localStorage.setItem("todoList", todos);

        const newLi = document.createElement('li');
        newLi.innerHTML = newText;
        newLi.addEventListener("contextmenu", todoRclick);
        newLi.addEventListener("dblclick", function(e) {
            todoDel(e.target);
        });

        inputElement.parentNode.replaceChild(newLi, inputElement);
    } else {
        const originalLi = document.createElement('li');
        originalLi.innerHTML = originalText;
        originalLi.addEventListener("contextmenu", todoRclick);
        originalLi.addEventListener("dblclick", function(e) {
            todoDel(e.target);
        });
        inputElement.parentNode.replaceChild(originalLi, inputElement);
    }
}


/*let bg = document.getElementById("body");
fetch('/api/random_bg', {method: "GET"})
    .then((response) => response.json())
    .then((data) => {
        let url = data.url;
        bg.style.backgroundImage = `radial-gradient(ellipse at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%), url('${url}')`;
    })*/
//let url = "https://images.unsplash.com/photo-1746121813274-50f7f8d4bad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NTA4MjN8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDcxNTg1NjB8&ixlib=rb-4.1.0&q=80&w=1080";

