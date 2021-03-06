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
const TaskTable = document.getElementById("TaskTable");
const TaskList = document.getElementById("TaskList");



// let taskCounter;
// TaskContract.methods.total_Tasks().call().then(
//     (data)=>{
//         taskCounter = Number(data);
//         console.log(taskCounter);
//     }
// );
// console.log(Number.isInteger(taskCounter));
// // const taskTemplate = document.getElementsByClassName("taskTemplate");

// let task;
// let TId = 0;
// for(var i = 1; i <= taskCounter; i++) {
//     console.log(i);
//     TaskContract.methods.getTask(1).call().on("error",
//     function (error, receipt) {
//         console.log({error, receipt});
//     }
// ).then(
//         (data)=>{
//             console.log(data);
//             TId = parseInt(data[0]);
//     }
//     );
// }   
// console.log(TId);




// Subscribe Events
TaskContract.events.taskCreated().on("data", (event)=>{
    taskCreatedEvent.innerHTML = event.returnValues.taskId;
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
            searchedTask.innerHTML = data[1];
        }
    );
}

// Add event listeners
TaskInputElement.addEventListener("change",handleInputChange);
TaskSaveBtn.addEventListener("click",handleClickEvent);
SearchTaskElement.addEventListener("change", handleSearchTaskChange);
SearchTaskBtn.addEventListener("click", handleSearchTaskBtn);
