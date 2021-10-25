using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class PlayerItem
    {
        #region Properties
        public int PlayerId { get; set; }

        public int ItemId { get; set; }

        public Player Player { get; set; }

        public Item Item { get; set; }
        #endregion
    }
}
