using Microsoft.AspNetCore.SignalR;

namespace SignalRSample.Hubs
{
    public class HouseGroupHub:Hub
    {
        public static List<string> GroupsJoined { get; set; } = new();

        private string userHouseList()
        {
            string houseList = "";
            foreach (var key in GroupsJoined)
            {
                if (key.StartsWith(Context.ConnectionId))
                {
                    houseList += key.Split(":")[1] + " ";
                }
            }

            return houseList;
        }

        public async Task JoinHouse(string houseName)
        {
            var listKey = Context.ConnectionId + ":" + houseName;
            if (!GroupsJoined.Contains(listKey))
            {
                GroupsJoined.Add(listKey);
                //do something else
                string houseList = userHouseList();

                await Clients.Caller.SendAsync("subcriptionStatus", houseList, houseName.ToLower(), true);
                await Clients.Others.SendAsync("newMemberAddedToHouse", houseName);
                await Groups.AddToGroupAsync(Context.ConnectionId, houseName);
            }
        }

        public async Task LeaveHouse(string houseName)
        {
            var listKey = Context.ConnectionId + ":" + houseName;
            if (GroupsJoined.Contains(listKey))
            {
                GroupsJoined.Remove(listKey);
                //do something else

                await Clients.Caller.SendAsync("subcriptionStatus", userHouseList(), houseName.ToLower(), false);
                await Clients.Others.SendAsync("newMemberRemovedFromHouse", houseName);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, houseName);
            }
        }

        public async Task TriggerHouseNotify(string houseName)
        {
            await Clients.Group(houseName).SendAsync("triggerHouseNotification", houseName);
        }
    }
}
