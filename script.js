
const userHeads = ["name", "age"];
const addForm = document.querySelector("#addForm")
const dataWrap = document.querySelector("#dataWrap")
const editForm = document.querySelector("#editForm")



const readFromStorage = (key= "users", dataType="array") => {
    let data
    try{
        data = JSON.parse(localStorage.getItem(key)) || []
        if(!Array.isArray(data) && dataType=="array") throw new Error("data is not an array")
    }
    catch(e){
        data = []
    }
    return data
}

const writeToStorage = (data, key="users") => {
    localStorage.setItem(key, JSON.stringify(data))
}

const createUserObject = (addForm, userId = null, useStatus = false) => {
    let user = { id: userId? userId: Date.now(), status: useStatus? addForm.elements.status.value : "active" };
    userHeads.forEach(head => user[head]= addForm.elements[head].value)
    return user 
}
const createMyOwnEle = (eleTag, parent, txtContent=null, classes=null) =>{
    const myNewElement = document.createElement(eleTag)
    if(classes)  myNewElement.classList = classes
    if(txtContent) myNewElement.innerText= txtContent
    parent.appendChild(myNewElement)
    return myNewElement
}
const delUser = (users, i)=>{
    users.splice(i,1)
    writeToStorage(users)
    draw(users)
}
const showSingle = (user) => {
    console.log(user);
    writeToStorage(user, "user")
    window.location.href = "single.html"
}
const draw = (users) => {
    dataWrap.innerHTML=""
    if(users.length==0){
        let tr = createMyOwnEle("tr", dataWrap, null, "alert alert-danger")
        let td = createMyOwnEle("td", tr, "no data found", "alert alert-danger")
        td.setAttribute("colspan", "5")
    }
    users.forEach((user, i)=>{
        let tr = createMyOwnEle("tr", dataWrap)
        createMyOwnEle("td", tr, user.id)
        createMyOwnEle("td", tr, user.name)
        createMyOwnEle("td", tr, user.age)
        createMyOwnEle("td", tr, user.status)
        let td = createMyOwnEle("td", tr)
        
        let edit = createMyOwnEle("button", td, "edit", "btn btn-warning mx-2")
        edit.addEventListener("click", () => showSingle(user))
        
        let del = createMyOwnEle("button", td, "Delete", "btn btn-danger mx-2")
        del.addEventListener("click", () => delUser(users, i))
    })
}

if(addForm){
    addForm.addEventListener("submit", function(e){
        e.preventDefault()
        const user = createUserObject(this)
        const users = readFromStorage()
        users.push(user)
        writeToStorage(users)
        window.location.href="index.html"
    })
}

if(dataWrap) {
    const users = readFromStorage()
    draw(users)
}

const handleErrors = (user) => {
    if (Number.isNaN(+user.age)) {
        errorElement.innerHTML = "Please enter Valid Age";
        return false;
    }
    if (user.status !== "active" && user.status !== "inActive") {
        errorElement.innerHTML = "Please enter Valid Status, active or inActive";
        return false;
    }
    return true;
}


const action = (e, id) => {
    e.preventDefault();
    let user = createUserObject(e.currentTarget, id, true);
    if (handleErrors(user)) {
        let users = readFromStorage("users");
        users[users.findIndex((user) => user.id === id)] = user;
        writeToStorage(users, "users");
        window.location.href = './index.html';
    }
}

if (editForm) {
    let user = readFromStorage("user", "object");
    userHeads.forEach(head => editForm.elements[head].value = user[head])
    editForm.elements["status"].value = user["status"];
    errorElement = createMyOwnEle("div", editForm);
    editForm.addEventListener("submit", (e) => action(e, user.id));
}





