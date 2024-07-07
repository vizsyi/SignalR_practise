using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;
using System.Security.Claims;

namespace SignalRSample.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _db;

        public ChatHub(ApplicationDbContext db)
        {
            this._db = db;
        }

        public override Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!String.IsNullOrEmpty(userId))
            {
                var userName = _db.Users.FirstOrDefault(u => u.Id == userId)?.UserName;
                if (!String.IsNullOrEmpty(userName))
                {
                    Clients.Users(HubConnections.OnlineUsers())
                        .SendAsync("ReceiveUserConnected", userId, userName, HubConnections.HasUser(userId));
                    HubConnections.AddUserConnection(userId, Context.ConnectionId);
                }
            }
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!String.IsNullOrEmpty(userId))
            {
                if (HubConnections.HasUserConnection(userId, Context.ConnectionId))
                {
                    var userConnections = HubConnections.Users[userId];
                    userConnections.Remove(Context.ConnectionId);
                    if(!userConnections.Any())
                    {
                        HubConnections.Users.Remove(userId);
                    }
                }
                
                
                var userName = _db.Users.FirstOrDefault(u => u.Id == userId)?.UserName;
                if (!String.IsNullOrEmpty(userName))
                {
                    Clients.Users(HubConnections.OnlineUsers())
                        .SendAsync("ReceiveUserDisconnected", userId, userName, HubConnections.HasUser(userId));
                    //HubConnections.AddUserConnection(userId, Context.ConnectionId);
                }
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendAddRoomMessage(int maxRoom, int roomId, string roomName)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!String.IsNullOrEmpty(userId))
            {
                var userName = _db.Users.FirstOrDefault(u => u.Id == userId)?.UserName;
                if (!String.IsNullOrEmpty(userName))
                {
                    await Clients.All.SendAsync("ReceiveAddRoomMessage", maxRoom, roomId, roomName, userName);
                }
            }
        }

        public async Task SendDeleteRoomMessage(int deleted, int selected, string roomName)
        {
            var userId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!String.IsNullOrEmpty(userId))
            {
                var userName = _db.Users.FirstOrDefault(u => u.Id == userId)?.UserName;
                if (!String.IsNullOrEmpty(userName))
                {
                    await Clients.All.SendAsync("ReceiveDeleteRoomMessage", deleted, selected, roomName, userName);
                }
            }
        }

    }
}
