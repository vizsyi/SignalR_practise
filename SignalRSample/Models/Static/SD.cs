namespace SignalRSample.Models.Static
{
    public static class SD
    {
        static SD()
        {
            //DeathlyHallowRace = new Dictionary<string, int>();
            DeathlyHallowRace.Add(Cloak, 0);
            DeathlyHallowRace.Add(Stone, 0);
            DeathlyHallowRace.Add(Wand, 0);
        }

        public const string Cloak = "cloak";
        public const string Stone = "stone";
        public const string Wand = "wand";

        public static Dictionary<string, int> DeathlyHallowRace = new ();
    }
}
