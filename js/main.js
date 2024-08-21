import ToDoItem from "./todoitem.js";
import ToDoList from "./todolist.js";


const toDoList = new ToDoList();

console.log('hello')
//Launch app
document.addEventListener('readystatechange', (event) => {
    if (event.target.readyState === 'complete') {
        initApp();
    }
});

const initApp = () => {
    //add listners
    const itemEntryForm = document.getElementById('itemEntryForm');
    itemEntryForm.addEventListener("submit", (event)=> {
        event.preventDefault();
        processSubmission()
    })

    const clearItems = document.getElementById('clearItems');
    clearItems.addEventListener("click" , (event) => {
        const list = toDoList.getList();
        if (list.length){
            const confirmed = confirm ('Are you sure you want to clear the entire list?');
            if(confirmed){
                toDoList.clearList();
                //TODO update persistant data
                updatePersistentData(toDoList.getList());
                refreshThePage();
            }
        }
    });

    // procedural
    //load list object
    loadListObject();
    refreshThePage();
};

const loadListObject = () => {
    const storedList = localStorage.getItem('myToDoList');
    if (typeof storedList !== "string") return;
    const parsedList = JSON.parse(storedList);
    parsedList.forEach((itemObj) => {
        const newToDoItem = createNewItem(itemObj._id, itemObj._item);
        toDoList.addItemToList(newToDoItem);
    })
}

const refreshThePage=() => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
};

const clearListDisplay = () => {
    const parentElement = document.getElementById('listItems');
    deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
};

const renderList = () => {
    const list = toDoList.getList();
    list.forEach((item) => {
        buildListItem(item);
    });

};

const buildListItem = (item) => {
   const div = document.createElement('div');
   div.className = 'item';
   const check = document.createElement('input');
   check.type = 'checkbox';
   check.id= item.getId()
   check.tableIndex = 0;
   addClickListnerToCheckbox(check);

   const label = document.createElement ('label');
   label.htmlFor = item.getId();
   label.textContent = item.getItem()
   div.appendChild(check);
   div.appendChild(label);
   const container = document.getElementById('listItems');
   container.appendChild(div);
  
}

const addClickListnerToCheckbox = (checkbox) => {
    checkbox.addEventListener('click', (event) => {
        toDoList.removeItemFromList(checkbox.id);
        //TODO remove from persistent data 
        updatePersistentData(toDoList.getList());
        setTimeout(()=> {
            refreshThePage();
        }, 1000);
    });
};

const updatePersistentData = (listArray) => {
    localStorage.setItem("myToDoList", JSON.stringify(listArray));
};

const clearItemEntryField =() => {
    document.getElementById('newItem').value="";
};

const setFocusOnItemEntry = () => {
    document.getElementById('newItem').focus();
};

const processSubmission = () => {
    const newEntryText = getNewEntry()
    if (!newEntryText.length) return;
    const newItemId = calcNextItemId();
    const ToDoItem = createNewItem(newItemId, newEntryText);
    toDoList.addItemToList(ToDoItem);
    //TODO update persistent data
    updatePersistentData(toDoList.getList());
    refreshThePage();
};

const getNewEntry = () => {
    return document.getElementById('newItem').value.trim();
};

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = toDoList.getList();
    if(list.length > 0) {
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;
}

const createNewItem = (itemId, itemText) => {
    const toDo = new ToDoItem();
    toDo.getId(itemId);
    toDo.setItem(itemText)
    return toDo;

}