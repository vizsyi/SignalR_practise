//getting the elements
const cloakSpan = document.getElementById("cloakCounter");
const stoneSpan = document.getElementById("stoneCounter");
const wandSpan = document.getElementById("wandCounter");

//create connection
const connectionDeathlyHallows = new signalR
    .HubConnectionBuilder()
    .withUrl("/hubs/deathlyhallows").build();

//connect to methods that hub invokes aka receive notification from hub
connectionDeathlyHallows.on("updateDeathlyHallowCount", (cloak, stone, wand) => {
    cloakSpan.innerText = cloak.toString();
    stoneSpan.innerText = stone.toString();
    wandSpan.innerText = wand.toString();
});

//invoke hub methods aka send notification

//start connection
function fulfilled(){
    connectionDeathlyHallows.invoke("GetRaceStatus").then(raceCounter => {
        cloakSpan.innerText = raceCounter.cloak.toString();
        stoneSpan.innerText = raceCounter.stone.toString();
        wandSpan.innerText = raceCounter.wand.toString();
    });
    console.log("Connection to DeathlyHallow Hub Successful");
}
function rejected(){
    //rejected logs
}

connectionDeathlyHallows.start().then(fulfilled, rejected);
