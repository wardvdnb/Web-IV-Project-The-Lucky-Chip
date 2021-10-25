using Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Api.Data
{
    public class ShopContext : IdentityDbContext
    {
        public ShopContext(DbContextOptions<ShopContext> options)
           : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Item>().Property(i => i.Name).IsRequired().HasMaxLength(200);
            //builder.Entity<Item>().Property(i => i.Price).IsRequired();

            builder.Entity<Player>().Property(p => p.NickName).IsRequired().HasMaxLength(50);
            builder.Entity<Player>().Property(p => p.Email).IsRequired().HasMaxLength(100);
            builder.Entity<Player>().Ignore(p => p.BoughtItems);

            builder.Entity<PlayerItem>().HasKey(p => new { p.PlayerId, p.ItemId });
            builder.Entity<PlayerItem>().HasOne(p => p.Player).WithMany(u => u.Items).HasForeignKey(p => p.PlayerId);
            builder.Entity<PlayerItem>().HasOne(p => p.Item).WithMany().HasForeignKey(p => p.ItemId);

            builder.Entity<Item>().HasData(
                new Item { Id = 1, Name = "Golden medal", Price = 10000 },
                 new Item { Id = 2, Name = "Silver medal", Price = 7500 },
                 new Item { Id = 3, Name = "Bronze medal", Price = 5000 }
            );
        }

        public DbSet<Item> Items { get; set; }
        public DbSet<Player> Players { get; set; }
    }
}
