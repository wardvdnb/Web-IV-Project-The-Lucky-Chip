using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models
{
    public class Item
    {
        #region Properties
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public int Price { get; set; }
        #endregion

        #region Constructors
        public Item()
        {
        }

        public Item(string name) : this()
        {
            Name = name;
            Price = 0;
        }
        #endregion

        #region Methods
        #endregion
    }
}
