//getting the elements
const viewCountSpan = document.getElementById("totalViewsCounter");
const userCountSpan = document.getElementById("totalUsersCounter");

//create connection
const connectionUserCount = new signalR
    .HubConnectionBuilder()
    .withUrl("/hubs/userCount").build();

//connect to methods that hub invokes aka receive notification from hub
connectionUserCount.on("updateTotalViews", (value) => {
    viewCountSpan.innerText = value.toString();
});

connectionUserCount.on("updateTotalUsers", (value) => {
    userCountSpan.innerText = value.toString();
});

//invoke hub methods aka send notification
function newWindowLoadedOnClient(){
    connectionUserCount.send("newWindowLoaded");
}

//start connection
function fulfilled(){
    //do something on start
    console.log("Connection to User Hub Successful");
    newWindowLoadedOnClient();
}
function rejected(){
    //rejected logs
}

connectionUserCount.start().then(fulfilled, rejected);
