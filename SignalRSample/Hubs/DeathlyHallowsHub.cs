using Microsoft.AspNetCore.SignalR;
using SignalRSample.Models.Static;

namespace SignalRSample.Hubs
{
    public class DeathlyHallowsHub:Hub
    {
        public Dictionary<string, int> GetRaceStatus()
        {
            return SD.DeathlyHallowRace;
        }
    }
}
