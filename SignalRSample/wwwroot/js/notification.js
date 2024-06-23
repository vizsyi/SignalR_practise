//getting the elements
const btn_send = document.getElementById("sendButton");
const notificationInput = document.getElementById("notificationInput");
const notificationCounter = document.getElementById("notificationCounter");
const messageList = document.getElementById("messageList");

btn_send.disabled = true;

//create connection
const connectionNotification = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/notification").build();

//connect to methods that hub invokes aka receive notification from hub
connectionNotification.on("LoadNotification", (message, counter) => {
    console.log("Bejött");
    messageList.innerHTML = "";
    notificationCounter.innerText = "(" + counter + ")";
    for (let i = message.length - 1; i >= 0; i--) {
        let li = document.createElement("li");
        li.textContent = "Notification - " + message[i];
        messageList.appendChild(li);
    }
});

//invoke hub methods aka send notification
btn_send.addEventListener("click", function (event) {
    event.preventDefault();
    let message = notificationInput.value;
    connectionNotification.send("SendMessage", message).then(function () {
        notificationInput.value = "";
    });
});

//start connection
function fulfilled(){
    //do something on start
    console.log("Connection to Notification Hub Successful");
    connectionNotification.send("LoadMessages");
    btn_send.disabled = false;
}
function rejected(){
    //rejected logs
}

connectionNotification.start().then(fulfilled, rejected);
