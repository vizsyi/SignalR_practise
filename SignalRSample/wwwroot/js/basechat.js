//getting the elements
const senderInp = document.getElementById("senderEmail"),
    receiverInp = document.getElementById("receiverEmail"),
    messageInp = document.getElementById("chatMessage"),
    sendBaseChatBtn = document.getElementById("sendMessage"),
    messagesList = document.getElementById("messagesList");

sendBaseChatBtn.disabled = true;
//create connection
const connectionBaseChat = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/baseChat").build();

//connect to methods that hub invokes aka receive notification from hub
connectionBaseChat.on("MessageReceived", (user, message) => {
    let liE = document.createElement("li");
    liE.textContent = `${user} - ${message}`;
    messagesList.appendChild(liE);
});

//invoke hub methods aka send notification
sendBaseChatBtn.addEventListener("click", event => {
    let sender = senderInp.value,
        message = messageInp.value,
        receiver = receiverInp.value;

    event.preventDefault();

    if (receiver.length > 0) {
        connectionBaseChat.send("SendMessageToReceiver", sender, receiver, message);
    }
    else {
        //send message to all of the users
        connectionBaseChat.send("SendMessageToAll", sender, message).catch(err => {
            return console.error(err.toString());
        });
    }
});

function newWindowLoadedOnClient(){
    connectionUserCount.send("newWindowLoaded");
}

//start connection
function fulfilled(){
    //do something on start
    sendBaseChatBtn.disabled = false;

    console.log("Connection to Basic Chat Hub Successful");
}
function rejected(){
    //rejected logs
}

connectionBaseChat.start().then(fulfilled, rejected);
