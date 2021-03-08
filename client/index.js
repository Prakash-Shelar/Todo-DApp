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
    var eventT = "";
    for (var i = 0; i < 4; i++) {
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
        eventT += T;
        li.appendChild(document.createTextNode(T));
        ul.appendChild(li);
    }
    taskCreatedEvent.innerHTML = eventT;


    var dBtn = document.createElement("button");
	dBtn.appendChild(document.createTextNode("Done"));
	li.appendChild(dBtn);
	dBtn.addEventListener("click", deleteListItem);
    
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

const handleSearchTaskBtn = () => {
    TaskContract.methods.getTask(searchElement).call().then(
        (data)=>{
            console.log("Getter",data);
            // searchedTask.innerHTML = data[1];
            var eventT = "";
            for (var i = 0; i < 5; i++) {
                if(i == 2){            
                    var ts = new Date(data[i]*1000);
                    
                    var t = ts.getDate()+
                    "/"+(ts.getMonth()+1)+
                    "/"+ts.getFullYear()+
                    " "+ts.getHours()+
                    ":"+ts.getMinutes()+
                    ":"+ts.getSeconds();
                    
                    var T = t + " || ";
                }
                else{
                    var T = data[i] + " || ";
                }
                eventT += T;
            }
            searchedTask.innerHTML = eventT;
        }
    );
}


// Add event listeners
TaskInputElement.addEventListener("change",handleInputChange);
TaskSaveBtn.addEventListener("click",handleClickEvent);
SearchTaskElement.addEventListener("change", handleSearchTaskChange);
SearchTaskBtn.addEventListener("click", handleSearchTaskBtn);
