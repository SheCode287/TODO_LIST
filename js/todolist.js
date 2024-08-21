export default class ToDoList{
    constructor(){
        this._list=[]
    }
 getList(){
    return this._list;
 }
 clearList(){
    this._list=[];
 }


 addItemToList(itemobj){
    this._list.push(itemobj);
 }

 removeItemFromList(id){
    const list = this._list;
    for (let i =0; i< list.length; i++){
        if (list[i]._id == id) {
            list.spice (i, 1)
            break;
        }
    }


   }





}

