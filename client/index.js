// const TaskJson = require('../build/contracts/TaskManager.json');
// const TaskAbi = TaskJson.abi;

const web3 = new Web3("ws://127.0.0.1:7545");

let defaultAccount;

web3.eth.getAccounts()
    .then(
        accounts => defaultAccount=accounts[0]
        );

const TaskContract = new web3.eth.Contract(TaskManagerAbi, TaskManagerAddress);

// Declare Variables
let TaskInput;
const TaskInputElement = document.getElementById("TaskInput");
const TaskSaveBtn = document.getElementById("TaskSave");

let searchElement;
const SearchTaskElement = document.getElementById("SearchTask");
const SearchTaskBtn = document.getElementById("SearchTaskBtn");
const searchedTask = document.getElementById("searchedTask");

const taskCreatedEvent = document.getElementById("taskCreatedEvent");
var ul = document.querySelector("ul");



// Subscribe Events
TaskContract.events.taskCreated().on("data", (event)=>{
        
    let Temptask = event.returnValues;

    var li = document.createElement('li');

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.id = Temptask[0];
    checkbox.addEventListener('change', handleCheckEvent)
    // checkbox.value = data[0];
    // checkbox.name = "todo[]";
    li.appendChild(checkbox);

    var eventT = "";
    for (var i = 0; i < 3; i++) {
        if(i == 2){            
            var ts = new Date(Temptask[i]*1000);
            
            var t = ts.getDate()+
            "/"+(ts.getMonth()+1)+
            "/"+ts.getFullYear()+
            " "+ts.getHours()+
            ":"+ts.getMinutes()+
            ":"+ts.getSeconds();
            
            var T = t + " || ";
        }
        else{
            var T = Temptask[i] + " || ";
        }
        li.appendChild(document.createTextNode(T));
        eventT += T;
        ul.appendChild(li);
    }
    taskCreatedEvent.innerHTML = eventT;
});


// Define Callback functions

// Create new task
const handleInputChange = (event) => {
    TaskInput = event.target.value;
}

const handleClickEvent = () => {
    TaskContract.methods.createTask(TaskInput).send({
        from: "0xDDc37c741a583eEE12dfeC31FD3d15359a558FCC",
        gas: "3000000",
        gasPrice: "1000000"
    })
    .on("error",
            function (error, receipt) {
                console.log({error, receipt});
            }
    )
}

// Search Task By Task Id
const handleSearchTaskChange = (event) => {
    searchElement = event.target.value;
}

const handleCheckEvent = (event) => {
    console.log(event.target.checked);
    const {id, checked} = event.target;
    console.log({id, checked});
    TaskContract.methods.toggleDone(id).send({
        from: "0xDDc37c741a583eEE12dfeC31FD3d15359a558FCC",
        gas: "3000000",
        gasPrice: "1000000"
    })
    .on("error",
            function (error, receipt) {
                console.log({error, receipt});
            }
    )
}

const handleSearchTaskBtn = () => {
    TaskContract.methods.getTask(searchElement).call().then(
        (data)=>{
            console.log("Getter",data);
            
            var eventT = "";
            for (var i = 0; i < 5; i++) {
                var T;
                if(i == 2){            
                    var ts = new Date(data[i]*1000);
                    
                    var t = ts.getDate()+
                    "/"+(ts.getMonth()+1)+
                    "/"+ts.getFullYear()+
                    " "+ts.getHours()+
                    ":"+ts.getMinutes()+
                    ":"+ts.getSeconds();
                    
                    T = t + " || ";
                }
                else if(i == 4 && data[4]!=0){            
                    var ts = new Date(data[i]*1000);
                    var t = ts.getDate()+
                    "/"+(ts.getMonth()+1)+
                    "/"+ts.getFullYear()+
                    " "+ts.getHours()+
                    ":"+ts.getMinutes()+
                    ":"+ts.getSeconds();
                    
                    var T = t + " || ";
                }
                else if(i == 3){
                    if(data[3] == true){
                        var T = "Completed" + " || ";
                    }
                    else{
                        var T = "Not Completed" + " || ";
                    }
                }
                else{
                    T = data[i] + " || ";
                }
                eventT += T;
            }
            searchedTask.innerHTML = eventT;
        }
    );
}

// Show all Tasks 
TaskContract.methods.total_Tasks().call().then(
    (data1)=>{
        newData = Number(data1);
        for(var j =1; j <= newData; j++){
             
            TaskContract.methods.getTask(j).call().then(
                (data)=>{
                    var li = document.createElement('li');

                    var checkbox = document.createElement('input');
                    checkbox.type = "checkbox";
                    checkbox.id=data[0];
                    if(data[3] == true){
                        checkbox.checked = "checked";
                    }
                    
                    checkbox.addEventListener('change',handleCheckEvent);
                    li.appendChild(checkbox);

                    for (var k = 0; k < 5; k++) {
                        if(k == 2){            
                            var ts = new Date(data[k]*1000);
                            var t = ts.getDate()+
                            "/"+(ts.getMonth()+1)+
                            "/"+ts.getFullYear()+
                            " "+ts.getHours()+
                            ":"+ts.getMinutes()+
                            ":"+ts.getSeconds();
                            
                            var T = t + " || ";
                        }
                        else if(k == 4 && data[4]!=0){            
                            var ts = new Date(data[k]*1000);
                            var t = ts.getDate()+
                            "/"+(ts.getMonth()+1)+
                            "/"+ts.getFullYear()+
                            " "+ts.getHours()+
                            ":"+ts.getMinutes()+
                            ":"+ts.getSeconds();
                            
                            var T = t + " || ";
                        }
                        else if(k == 4 && data[4]==0){
                            var T = "";
                        }
                        else if(k == 3){
                            if(data[3] == true){
                                var T = "Completed" + " || ";
                            }
                            else{
                                var T = "Not Completed" + " || ";
                            }
                        }
                        else{
                            var T = data[k] + " || ";
                        }
                        
                        li.appendChild(document.createTextNode(T));
                    }
                    li.id = data[0];
                    ul.appendChild(li);
                }
            );
        }
    }
    
)

// Add event listeners
TaskInputElement.addEventListener("change",handleInputChange);
TaskSaveBtn.addEventListener("click",handleClickEvent);
SearchTaskElement.addEventListener("change", handleSearchTaskChange);
SearchTaskBtn.addEventListener("click", handleSearchTaskBtn);