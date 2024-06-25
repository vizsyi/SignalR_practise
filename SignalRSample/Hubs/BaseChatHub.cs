using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;

namespace SignalRSample.Hubs
{
    public class BaseChatHub : Hub
    {
        private readonly ApplicationDbContext _db;

        public BaseChatHub(ApplicationDbContext db)
        {
            this._db = db;
        }

        public async Task SendMessageToAll(string sender, string message)
        {
            await Clients.All.SendAsync("MessageReceived", sender, message);
        }

        [Authorize]
        public async Task SendMessageToReceiver(string sender, string receiver, string message)
        {
            var userId = _db.Users.FirstOrDefault(u => u.NormalizedEmail.ToUpper() == receiver.ToUpper()).Id;
            //todo: nullcheck, normal
            if (!String.IsNullOrEmpty(userId))
            {
                await Clients.User(userId).SendAsync("MessageReceived", sender, message);
            }
        }
    }
}
