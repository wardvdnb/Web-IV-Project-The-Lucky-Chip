using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public interface IItemRepository
    {
        Item GetBy(int id);
        bool TryGetItem(int id, out Item item);
        IEnumerable<Item> GetAll();
        void Add(Item item);
        void Delete(Item item);
        void Update(Item item);
        void SaveChanges();
    }
}
