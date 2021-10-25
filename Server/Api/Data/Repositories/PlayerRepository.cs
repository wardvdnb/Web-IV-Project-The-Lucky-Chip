using Api.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Data.Repositories
{
    public class PlayerRepository : IPlayerRepository
    {
        private readonly ShopContext _context;
        private readonly DbSet<Player> _players;

        public PlayerRepository(ShopContext dbContext)
        {
            _context = dbContext;
            _players = dbContext.Players;
        }

        public Player GetBy(string nickname)
        {
            return _players
                .Include(p => p.Items)
                .ThenInclude(i => i.Item).SingleOrDefault(p => p.NickName == nickname);
        }

        public void Add(Player player)
        {
            _players.Add(player);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
