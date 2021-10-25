using Api.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Data.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly ShopContext _context;
        private readonly DbSet<Item> _items;

        public ItemRepository(ShopContext dbContext)
        {
            _context = dbContext;
            _items = dbContext.Items;
        }

        public IEnumerable<Item> GetAll()
        {
            return _items.ToList();
        }

        public Item GetBy(int id)
        {
            return _items.SingleOrDefault(i => i.Id == id);
        }

        public bool TryGetItem(int id, out Item item)
        {
            item = _context.Items.FirstOrDefault(i => i.Id == id);
            return item != null;
        }

        public void Add(Item item)
        {
            _items.Add(item);
        }

        public void Update(Item item)
        {
            _context.Update(item);
        }

        public void Delete(Item item)
        {
            _items.Remove(item);
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }
    }
}
