pragma solidity ^0.8.0;

contract TaskManager {
    
    struct Task {
        uint taskId;
        string data;
        uint createdOn;
        bool done;
        uint completedOn;
    }
    mapping(uint => Task) tasks;
    uint taskCounter;
    uint[] taskIds;
    
    event taskCreated(uint taskId,string data, uint createdOn, bool done);
    event taskStatusToggled(uint id, bool done, uint completedOn);
    
    modifier taskExist(uint id) {
        require(tasks[id].taskId != 0, "Task is not exist");
        _;
    }
    
    modifier checkTaskId() {
        require(taskIds.length > 0, "No any Task created.");
        _;
    }
    
    function createTask(string memory _data)public {
        taskCounter++;
        Task memory task = Task(taskCounter, _data, block.timestamp, false,0);
        tasks[taskCounter] = task;
        taskIds.push(taskCounter);
        emit taskCreated(taskCounter, _data, block.timestamp, false);
    }
    
    function toggleDone(uint id) public taskExist(id){
        tasks[id].done = !tasks[id].done;
        tasks[id].completedOn = tasks[id].done ? block.timestamp: 0;
        emit taskStatusToggled(id, tasks[id].done, tasks[id].completedOn);
    }
    
    function getTask(uint id) public taskExist(id) view returns(uint, string memory, uint, bool, uint) {
        return(tasks[id].taskId, tasks[id].data, tasks[id].createdOn, tasks[id].done, tasks[id].completedOn);
    }
    
    function get_Task_Ids()public checkTaskId view returns(uint[] memory) {
        return taskIds;
    }
    
    function total_Tasks() public view returns(uint) {
        return taskIds.length;
    }
}