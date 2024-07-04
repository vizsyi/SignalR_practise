//getting the elements
const messagesUI = document.getElementById("messagesList");


//create connection
const connectionChat = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat")
    .withAutomaticReconnect([0, 1000, 5000, null])
    .build();

//connect to methods that hub invokes aka receive notification from hub
function addMessage(msg) {
    if (msg === null || msg === "") return;

    let liE = document.createElement("li");
    liE.textContent = msg;
    messagesUI.appendChild(liE);
}

connectionChat.on("ReceiveUserConnected", (userId, userName, hasUserConnection) => {
    if (!hasUserConnection) {
        addMessage(`${userName} is online`);
    }
});

connectionChat.on("ReceiveUserDisconnected", (userId, userName, hasUserConnection) => {
    if (!hasUserConnection) {
        addMessage(`${userName} has left the chat`);
    }
});

//invoke hub methods aka send notification


//start connection
function fulfilled() {
    //do something on start

    console.log("Connection to Chat Hub Successful");
}
function rejected() {
    //rejected logs
}

connectionChat.start().then(fulfilled, rejected);
