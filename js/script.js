document.addEventListener('DOMContentLoaded', function () {
  const submit = document.querySelector('#form');
  submit.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });
});

function addTodo() {
  const text = document.querySelector('#title').value;
  const time = document.querySelector('#date').value;

  const generatedID = generateID();
  const todoObject = generateTodoObject(generatedID, text, time, false);
  todos.push(todoObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function generateID() {
  return +new Date();
}

function generateTodoObject(id, task, time, isCompleted) {
  return {
    id,
    task,
    time,
    isCompleted,
  };
}

const todos = [];
const RENDER_EVENT = 'render-todo';

document.addEventListener(RENDER_EVENT, function () {
  const uncompleted = document.querySelector('#uncomplete');
  uncompleted.innerHTML = '';

  const completed = document.querySelector('#complete');
  completed.innerHTML = '';

  for (const item of todos) {
    const element = show(item);
    if(!item.isCompleted)
    uncompleted.append(element);
    else
      completed.append(element)
  }

  
});
function show(todoObject) {
  const title = document.createElement('h2');
  title.innerText = todoObject.task;
  
  const time = document.createElement('p');
  time.innerText = todoObject.time;

  const tc = document.createElement('div');
  tc.classList.add('inner');
  tc.append(title, time);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(tc);
  container.setAttribute('id', `todo-${todoObject.id}`);
  
  if(todoObject.isCompleted){
    const undobtn = document.createElement("button");
    undobtn.classList.add('undo');
  
    undobtn.addEventListener('click', function (){
      undoTask(todoObject.id)
    })
    
    const trashbtn = document.createElement('button');
    trashbtn.classList.add('trash');
    
    trashbtn.addEventListener('click', function(){
      removeTask(todoObject.id);
    });
    container.append(undobtn, trashbtn)
  }else{
    const checkbtn = document.createElement('button');
    checkbtn.classList.add('check');

    checkbtn.addEventListener('click', function(){
      addTask(todoObject.id);
    })

    container.append(checkbtn);
  }
  return container;
}

function addTask(todoId){
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function findTodo(todoId){
  for(const item of todos){
    if(item.id === todoId){
      return item;
    }
  }
  return null;
}

function undoTask(todoId){
  const todoTarget = findTodo(todoId);
  if(todoTarget == null) return;

  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function removeTask(todoId){
  const todoTarget = findTodoIndex(todoId)
  if(todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
}

function findTodoIndex(todoId){
  for(const index in todos){
    if(todos[index].id == todoId){
      return index;
    }
  }

  return -1;
}


const sk = 'sk'
SAVED_EVENT = 'save-todo'
function saveData(){
  if(isStorageExist()){
    const parsed = JSON.stringify(todos);
    localStorage.setItem(sk, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

function isStorageExist(){
  if(typeof (Storage) === undefined){
    alert('Your browser does not support web storage');
    return false
  }
  return true;
}

function loadData(){
  const serialized = localStorage.getItem(sk)
  let data = JSON.parse(serialized)

  if(data !== null){
    for (const todo of data){
      todos.push(todo)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}

document.addEventListener('DOMContentLoaded', function(){
  if(isStorageExist()){
    loadData()
  }
})


// const title = (document.innerHTML = `<h2>${todoObject.task}</h2>`);

