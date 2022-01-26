let LIST = [
     {name: "Complete online Javascript course", status: false, index:0},
     {name: "Jog around the park 3x", status: true, index:1},
     {name: "10 minutes meditation", status: true, index:2},
     {name: "Read for 1 hour", status: true, index:3},
     {name: "Pick up groceries", status: true, index:4},
     {name: "Complete Todo App on Frontend Mentor", status: true, index:5},
];

let id_todo = returnLastId(LIST) | 0;
const LIST_HTML = document.querySelector('.list-jobs');
const NEW_JOB = document.querySelector('.list-new input');
const STATUS = document.querySelectorAll('.list-status');
let INITIAL_POSITION = 0;
let INIT_ID;
let END_ID;

function returnLastId(LIST) {
     let last = 0;
     last = LIST.reduce( (a, item) => {
          if( item.index>last) {
               a = item.index;
          }
          return a;
     });
     return last+1;
}

function update(list) {
          LIST_HTML.innerHTML = list.reduce( (a, item) => {
                    a+=  `<div class="list-item item${item.index} ${item.status? "" : "inactive"}" draggable="true">
                    <div class="list-circle"></div>
                    <span>${item.name}</span>
                    <img class= "list-cross" src="./images/icon-cross.svg" alt="cross">
                    </div>`;
                    return a;
          }, "");
          let listLen = LIST.filter(item=>item.status).length;
          STATUS.forEach(item => item.innerHTML = `${listLen} ${listLen>1?"items": "item"} left`);
          updateEvents();
}

function add(name) {
     LIST = [{name, status:true, index:id_todo}, ...LIST];
     id_todo++;
     update(LIST);
}

function changeStatus(e) {
     const id = e.path[1].className.match(/(?<=item)\d+/)[0];
     LIST = LIST.map( item => {
               if (item.index==id) {
                         item.status = !item.status;
               }
               return item;
     }, []);
     update(LIST);
}

function changeActive() {
     document.querySelectorAll('.list-options li').forEach(item => item.classList.remove('active'));
     this.classList.add('active');
     switch (this.textContent) {
          case "All":
               update(LIST);
               break;
          case "Active":
               update(LIST.filter(item => item.status));
               break;
          case "Completed":
               update(LIST.filter(item => !item.status));
               break;
     
     }
}

function deleteTodo(e) {
     const id = e.path[1].className.match(/(?<=item)\d+/)[0];
     LIST = LIST.filter( item =>{
          if( item.index!=id) {
               return true;
          } else if (item.status) {
               return true;
          }
          e.path[1].style.transform = "scaleY(0)";
          return false;
     });
     setTimeout( ()=> update(LIST) ,200)
}

function deleteAll() {
     LIST = LIST.filter( item => item.status);
     update(LIST);
}

function updateEvents() {
     document.querySelectorAll('.list-options li:not(.list-status, .list-clear)').forEach(item => item.addEventListener('click', changeActive));
     document.querySelectorAll('.list-clear').forEach(item => item.addEventListener('click', deleteAll));
     document.querySelectorAll('.list-cross').forEach(item => item.addEventListener('click', deleteTodo));
     document.querySelectorAll('.list-circle').forEach(item => item.addEventListener('click', changeStatus));
     document.querySelectorAll("header img").forEach(item => item.addEventListener('click', changeTheme));
     document.querySelectorAll(".list-item").forEach( item => {
          item.addEventListener('dragstart', dragStart);
          item.addEventListener('drag', dragItem);
          item.addEventListener('dragend', dragEnd);
          item.addEventListener('dragenter', dragEnter);
          item.addEventListener('dragover', dragOver);
          item.addEventListener('dragleave', dragLeave);
          item.addEventListener('drop', dragDrop);
     });
}

function changeTheme() {
     document.body.classList.toggle('dark');
}

function dragStart(e) {
     this.style.position = "relative";
     INITIAL_POSITION = {x: e.clientX,y:e.clientY} 
     INIT_ID = this.className.match(/(?<=item)\d+/)[0];
}

function dragItem(e) {


     // const MOUSE_Y =  e.clientY;
     // const BOX_TOP =  e.target.offsetTop;
     // const moveY = MOUSE_Y - INITIAL_POSITION.y

     // e.target.style.top = `${moveY}px`;

}

function dragEnd(e) {
     this.style.top = 0;
}

function dragEnter(e) {
     this.style.border = '3px dashed green';
}

function dragOver(e) {
     e.preventDefault();
     this.style.border = '3px dashed green';
}

function dragLeave(e) {
     this.style.border = '3px dashed transparent';
}

function dragDrop(e) {
     
     END_ID = this.className.match(/(?<=item)\d+/)[0];     
     
     this.style.border = '3px dashed transparent';

     changeTasks(INIT_ID, END_ID);
}

function changeTasks(init, end) {
     if (init==end) return;
     let LIST_TEMPORAL = [...LIST];
    let indices =  LIST.reduce( (a, item, index) => {
          if(item.index==init || item.index==end) {
               a.push(index);
               return a;
          }
          return a;
     }, []);

     LIST_TEMPORAL[indices[0]] = LIST[indices[1]];
     LIST_TEMPORAL[indices[1]] = LIST[indices[0]];

     LIST = LIST_TEMPORAL;
     update(LIST);
}

update(LIST);




NEW_JOB.addEventListener('keydown', e => {
     if(e.key=="Enter") {
          add(e.target.value);
          e.target.value = "";
     }
});

updateEvents();



