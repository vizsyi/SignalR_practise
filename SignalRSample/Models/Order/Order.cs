using System.ComponentModel.DataAnnotations;

namespace SignalRSample.Models.Order
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = "";
        [Required]
        public string ItemName { get; set; } = "";
        [Required]
        public int Count { get; set; }
    }
}
