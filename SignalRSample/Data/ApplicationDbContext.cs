using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SignalRSample.Models.Chat;
using SignalRSample.Models.Order;

namespace SignalRSample.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Order> Order { get; set; }

    public DbSet<ChatRoom> ChatRoom { get; set; }
}
