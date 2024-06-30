using SignalRSample.Controllers;

namespace SignalRSample.Models.Chat.ViewModels
{
    public class ChatVM
    {
        public ChatVM()
        {
        }

        public int MaxRoomAllowed { get; set; }

        public IList<ChatRoom> Rooms { get; set; } = new List<ChatRoom>();

        public string? UserId { get; set; }

        public bool AllowAddRoom => Rooms == null || Rooms.Count < MaxRoomAllowed;
    }
}
