using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public interface IPlayerRepository
    {
        Player GetBy(string nickname);
        void Add(Player player);
        void SaveChanges();
    }
}
