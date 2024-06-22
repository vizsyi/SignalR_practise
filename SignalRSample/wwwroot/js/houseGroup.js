//getting the elements
const lbl_houseJoined = document.getElementById("lbl_houseJoined");

const btn_gryffindor = document.getElementById("btn_gryffindor");
const btn_slytherin = document.getElementById("btn_slytherin");
const btn_hufflepuff = document.getElementById("btn_hufflepuff");
const btn_ravenclaw = document.getElementById("btn_ravenclaw");

const btn_un_gryffindor = document.getElementById("btn_un_gryffindor");
const btn_un_slytherin = document.getElementById("btn_un_slytherin");
const btn_un_hufflepuff = document.getElementById("btn_un_hufflepuff");
const btn_un_ravenclaw = document.getElementById("btn_un_ravenclaw");

const trigger_gryffindor = document.getElementById("trigger_gryffindor");
const trigger_slytherin = document.getElementById("trigger_slytherin");
const trigger_hufflepuff = document.getElementById("trigger_hufflepuff");
const trigger_ravenclaw = document.getElementById("trigger_ravenclaw");

//create connection
const connectionHouse = new signalR
    .HubConnectionBuilder()
    .withUrl("/hubs/houseGroup").build();

//connect to methods that hub invokes aka receive notification from hub
connectionHouse.on("subcriptionStatus", (strGroupsJoined, houseName, hasSubscribed) => {
    lbl_houseJoined.innerText = strGroupsJoined;

    if (hasSubscribed) {
        //subscribe to
        switch (houseName) {
            case "gryffindor":
                btn_gryffindor.style.display = "none";
                btn_un_gryffindor.style.display = "";
                break;
            case "slytherin":
                btn_slytherin.style.display = "none";
                btn_un_slytherin.style.display = "";
                break;
            case "hufflepuff":
                btn_hufflepuff.style.display = "none";
                btn_un_hufflepuff.style.display = "";
                break;
            case "ravenclaw":
                btn_ravenclaw.style.display = "none";
                btn_un_ravenclaw.style.display = "";
                break;
            default:
                break;
        }

        toastr.success(`You have subscribed Successfully ${houseName}.`);
    }
    else {
        //unsubscribe to
        switch (houseName) {
            case "gryffindor":
                btn_gryffindor.style.display = "";
                btn_un_gryffindor.style.display = "none";
                break;
            case "slytherin":
                btn_slytherin.style.display = "";
                btn_un_slytherin.style.display = "none";
                break;
            case "hufflepuff":
                btn_hufflepuff.style.display = "";
                btn_un_hufflepuff.style.display = "none";
                break;
            case "ravenclaw":
                btn_ravenclaw.style.display = "";
                btn_un_ravenclaw.style.display = "none";
                break;
            default:
                break;
        }

        toastr.success(`You have unsubscribed ${houseName}.`);
    }

});

connectionHouse.on("triggerHouseNotification", houseName => {
    toastr.success(`A new notfication for ${houseName} has been launched`);
});

connectionHouse.on("newMemberAddedToHouse", houseName => {
    toastr.info(`Member has subscribed to ${houseName}`);
});

connectionHouse.on("newMemberRemovedFromHouse", houseName => {
    toastr.warning(`Member has unsubscribed from ${houseName}`);
});

//invoke hub methods aka send notification
btn_gryffindor.addEventListener("click", function (event) {
    connectionHouse.send("JoinHouse", "Gryffindor");
    event.preventDefault();
});
btn_slytherin.addEventListener("click", function (event) {
    connectionHouse.send("JoinHouse", "Slytherin");
    event.preventDefault();
});
btn_hufflepuff.addEventListener("click", function (event) {
    connectionHouse.send("JoinHouse", "Hufflepuff");
    event.preventDefault();
});
btn_ravenclaw.addEventListener("click", function (event) {
    connectionHouse.send("JoinHouse", "Ravenclaw");
    event.preventDefault();
});

btn_un_gryffindor.addEventListener("click", function (event) {
    connectionHouse.send("LeaveHouse", "Gryffindor");
    event.preventDefault();
});
btn_un_slytherin.addEventListener("click", function (event) {
    connectionHouse.send("LeaveHouse", "Slytherin");
    event.preventDefault();
});
btn_un_hufflepuff.addEventListener("click", function (event) {
    connectionHouse.send("LeaveHouse", "Hufflepuff");
    event.preventDefault();
});
btn_un_ravenclaw.addEventListener("click", function (event) {
    connectionHouse.send("LeaveHouse", "Ravenclaw");
    event.preventDefault();
});

trigger_gryffindor.addEventListener("click", function (event) {
    connectionHouse.send("TriggerHouseNotify", "Gryffindor");
    event.preventDefault();
});
trigger_slytherin.addEventListener("click", function (event) {
    connectionHouse.send("TriggerHouseNotify", "Slytherin");
    event.preventDefault();
});
trigger_hufflepuff.addEventListener("click", function (event) {
    connectionHouse.send("TriggerHouseNotify", "Hufflepuff");
    event.preventDefault();
});
trigger_ravenclaw.addEventListener("click", function (event) {
    connectionHouse.send("TriggerHouseNotify", "Ravenclaw");
    event.preventDefault();
});
//start connection
function fulfilled(){
    connectionHouse.invoke("GetRaceStatus").then(raceCounter => {
        cloakSpan.innerText = raceCounter.cloak.toString();
        stoneSpan.innerText = raceCounter.stone.toString();
        wandSpan.innerText = raceCounter.wand.toString();
    });
    console.log("Connection to HouseGroup Hub Successful");
}
function rejected(){
    //rejected logs
}

connectionHouse.start().then(fulfilled, rejected);
