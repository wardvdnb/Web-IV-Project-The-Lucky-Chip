using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Player
    {
        #region Properties
        //add extra properties if needed
        public int PlayerId { get; set; }

        public string NickName { get; set; }


        public string Email { get; set; }

        public int Money { get; set; } = 0;

        public ICollection<PlayerItem> Items { get; private set; }

        public IEnumerable<Item> BoughtItems => Items.Select(f => f.Item);
        #endregion

        #region Constructors
        public Player()
        {
            Items = new List<PlayerItem>();
        }
        #endregion

        #region Methods
        public void AddBoughtItem(Item item)
        {
            if(!Items.Any(i => i.ItemId == item.Id))
            {
                Items.Add(new PlayerItem() { ItemId = item.Id, PlayerId = this.PlayerId, Item = item, Player = this });
            }
        }

        public void IncrementMoney(int amount)
        {
            Money += amount;
        }
        #endregion
    }
}
