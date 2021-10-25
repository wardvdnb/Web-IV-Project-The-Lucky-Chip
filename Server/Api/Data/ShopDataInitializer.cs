using Api.Models;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Api.Data
{
    public class ShopDataInitializer
    {
        private readonly ShopContext _dbContext;
        private readonly UserManager<IdentityUser> _userManager;

        public ShopDataInitializer(ShopContext dbContext, UserManager<IdentityUser> userManager)
        {
            _dbContext = dbContext;
            _userManager = userManager;
        }

        public async Task InitializeData()
        {
            _dbContext.Database.EnsureDeleted();
            if (_dbContext.Database.EnsureCreated())
            {
                //seeding the database with items, see DBContext     
                Player player = new Player { Email = "gamingmaster@gmail.com", NickName = "xXGamingMasterXx", Money = 10000};
                player.AddBoughtItem(_dbContext.Items.First());
                _dbContext.Players.Add(player);
                await CreateUser(player.Email, player.NickName, "P@ssword1111");

                Player player2 = new Player { Email = "gamblinggod@gmail.com", NickName = "TheGamblingGod420" };
                _dbContext.Players.Add(player2);
                player2.AddBoughtItem(_dbContext.Items.First());
                await CreateUser(player2.Email, player2.NickName, "P@ssword1111");

                Player admin = new Player { Email = "admin@administrator.com", NickName = "TheAdministrator" };
                _dbContext.Players.Add(admin);
                await CreateUser(admin.Email, admin.NickName, "Admin@ccount123456");

                IdentityUser administrator = await _userManager.FindByEmailAsync("admin@administrator.com");
                Debug.WriteLine(administrator);
                await _userManager.AddClaimAsync(administrator, new Claim(ClaimTypes.Role, "admin"));

                _dbContext.SaveChanges();
            }
        }

        private async Task CreateUser(string email, string nickname, string password)
        {
            var user = new IdentityUser { UserName = nickname, Email = email };
            await _userManager.CreateAsync(user, password);
        }
    }

}
