//getting the elements
const messagesUI = document.getElementById("messagesList"),
    ddlDelRoomInp = document.getElementById('ddlDelRoom');

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

connectionChat.on("ReceiveAddRoomMessage", (maxRoom, roomId, roomName, userName) => {
    addMessage(`${userName} has created room ${roomName}`);
    fillRoomDropDown();
});

connectionChat.on("ReceiveDeleteRoomMessage", (deleted, selected, roomName, userName) => {
    addMessage(`${userName} has deleted room ${roomName}`);
    fillRoomDropDown();
    ddlDelRoomInp.value = selected;
});

//invoke hub methods aka send notification
function addNewRoom(maxRoom) {

    const createRoomName = document.getElementById('createRoomName');

    let roomName = createRoomName.value;

    if (roomName == null || roomName == '') {
        return;
    }

    /*POST*/
    $.ajax({
        url: '/ChatRooms/PostChatRoom',
        dataType: "json",
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ id: 0, name: roomName }),
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            /*ADD ROOM COMPLETED SUCCESSFULLY*/
            connectionChat.invoke("SendAddRoomMessage", maxRoom, json.id, json.name);
            createRoomName.value = '';
        },
        error: function (xhr) {
            alert('error');
        }
    });
}

function deleteRoom() {
    let roomId = ddlDelRoomInp.value,
        roomName = ddlDelRoomInp.options[ddlDelRoomInp.selectedIndex].text,
        confText = `Do you want to delete Chat Room ${roomName}?`;

    if (confirm(confText) === false) {
        return;
    }

    if (roomId == null || roomId == '') {
        return;
    }

    /*delete*/
    $.ajax({
        url: `/ChatRooms/DeleteChatRoom/${roomId}`,
        dataType: "json",
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        async: true,
        processData: false,
        cache: false,
        success: function (json) {

            /*DELETE ROOM COMPLETED SUCCESSFULLY*/
            connectionChat.invoke("SendDeleteRoomMessage", json.deleted, json.selected, roomName);
        },
        error: function (xhr) {
            alert('nyavaja error');
        }
    });
}

function fillUserDropDown() {

    $.getJSON('/ChatRooms/GetChatUsers')
        .done(function (json) {

            var ddlSelUser = document.getElementById("ddlSelUser");

            ddlSelUser.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.userName;//item.whateverProperty
                newOption.value = item.id;
                ddlSelUser.add(newOption);

            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });
}

function fillRoomDropDown() {

    $.getJSON('/ChatRooms/GetChatRooms')
        .done(function (json) {
            var ddlDelRoom = document.getElementById("ddlDelRoom");
            var ddlSelRoom = document.getElementById("ddlSelRoom");

            ddlDelRoom.innerText = null;
            ddlSelRoom.innerText = null;

            json.forEach(function (item) {
                var newOption = document.createElement("option");

                newOption.text = item.name;
                newOption.value = item.id;
                ddlDelRoom.add(newOption);


                var newOption1 = document.createElement("option");

                newOption1.text = item.name;
                newOption1.value = item.id;
                ddlSelRoom.add(newOption1);

            });

        })
        .fail(function (jqxhr, textStatus, error) {

            var err = textStatus + ", " + error;
            console.log("Request Failed: " + jqxhr.detail);
        });

}

document.addEventListener('DOMContentLoaded', (event) => {
    fillRoomDropDown();
    fillUserDropDown();
});

//start connection
function fulfilled() {
    //do something on start

    console.log("Connection to Chat Hub Successful");
}
function rejected() {
    //rejected logs
}

connectionChat.start().then(fulfilled, rejected);
