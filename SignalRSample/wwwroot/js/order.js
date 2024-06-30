//getting the elements
let dataTable;

//create connection
const connectionOrder = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/order").build();

$(document).ready(function () {
    loadDataTable();
    console.log("REady rész");
});

function loadDataTable() {

    dataTable = $('#tblData').DataTable({
        "ajax": {
            "url": "/Home/GetAllOrder"
        },
        "columns": [
            { "data": "id", "width": "5%" },
            { "data": "name", "width": "15%" },
            { "data": "itemName", "width": "15%" },
            { "data": "count", "width": "15%" },
            {
                "data": "id",
                "render": function (data) {
                    return `
                        <div class="w-75 btn-group" role="group">
                        <a href=""
                        class="btn btn-primary mx-2"> <i class="bi bi-pencil-square"></i> </a>
                      
					</div>
                        `
                },
                "width": "5%"
            }
        ]
    });
}

//connect to methods that hub invokes aka receive notification from hub
connectionOrder.on("newOrder", () => {
    dataTable.ajax.reload();
    toastr.info("New order recieved");
});

//start connection
function fulfilled() {
    //do something on start

    console.log("Connection to Order Hub Successful");
}
function rejected() {
    //rejected logs
}

connectionOrder.start().then(fulfilled, rejected);
