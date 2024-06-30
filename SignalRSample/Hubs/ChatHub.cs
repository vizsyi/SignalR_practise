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
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!String.IsNullOrEmpty(userId))
            {
                var userName = _db.Users.FirstOrDefault(u => u.Id == userId)?.UserName;
                if (!String.IsNullOrEmpty(userName))
                {
                    Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserConnected", userId, userName);
                    HubConnections.AddUserConnection(userId, Context.ConnectionId);
                }
            }
            return base.OnConnectedAsync();
        }

    }
}
