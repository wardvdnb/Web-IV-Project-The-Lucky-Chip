using Api.DTOs;
using Api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Api.Controllers
{
    [ApiConventionType(typeof(DefaultApiConventions))]
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly IItemRepository _itemRepository;
        private readonly IPlayerRepository _playerRepository;


        public ItemsController(IItemRepository context, IPlayerRepository playerRepsitory)
        {
            _itemRepository = context;
            _playerRepository = playerRepsitory;
        }

        // GET: api/Items
        /// <summary>
        /// Get all items ordered by name
        /// </summary>
        /// <returns>All Items</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [AllowAnonymous]
        //OPMERKING: [ApiConventionType(typeof(DefaultApiConventions))] bovenaan de controller als alternatief voor individuele response types
        public ActionResult<IEnumerable<Item>> GetItems()
        {
            //return StatusCode(StatusCodes.Status500InternalServerError);
            
            IEnumerable<Item> items;
            if (!User.Identity.IsAuthenticated)
            {
                items = _itemRepository.GetAll().OrderBy(r => r.Name).ToList();
            }
            else
            {
                Player player = _playerRepository.GetBy(User.Identity.Name);
                IEnumerable<Item> playerItems = player.BoughtItems.OrderBy(r => r.Name).ToList();
                //peopleList2.Where(p => !peopleList1.Any(p2 => p2.ID == p.ID));
                items = _itemRepository.GetAll().Where(p => !playerItems.Any(p2 => p2.Id == p.Id)).OrderBy(r => r.Name).ToList();
            }
            if (items.Count() == 0)
                return StatusCode(StatusCodes.Status500InternalServerError);
            return Ok(items);
        }

        // GET: api/Items/id
        /// <summary>
        /// Get item by id
        /// </summary>
        /// <param name="id">id of the item</param>
        /// <returns>The item</returns>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public ActionResult<Item> GetItem(int id)
        {
            Item item = _itemRepository.GetBy(id);
            if (item == null) return NotFound();
            return item;
        }

        // POST: api/Items
        /// <summary>
        /// Adds a new item
        /// </summary>
        /// <param name="item">the new item</param>
        [HttpPost]
        //[Authorize(Policy = "AdminOnly")]
        [Authorize]
        public ActionResult<Item> PostItem(ItemDTO item)
        {
            Item itemToCreate = new Item() { Name = item.Name, Price = item.Price };
            _itemRepository.Add(itemToCreate);
            _itemRepository.SaveChanges();

            return CreatedAtAction(nameof(GetItem), new { id = itemToCreate.Id }, item);
        }

        // PUT: api/Items/5
        /// <summary>
        /// Modifies an item
        /// </summary>
        /// <param name="id">id of the item to be modified</param>
        /// <param name="item">the modified item</param>
        [HttpPut("{id}")]
        //[Authorize(Policy = "AdminOnly")]
        [Authorize]
        public IActionResult PutItem(int id, Item item)
        {
            if (id != item.Id)
            {
                return BadRequest();
            }
            _itemRepository.Update(item);
            _itemRepository.SaveChanges();
            return NoContent();
        }

        // DELETE: api/Items/5
        /// <summary>
        /// Deletes an item
        /// </summary>
        /// <param name="id">the id of the item to be deleted</param>
        [HttpDelete("{id}")]
        //[Authorize(Policy = "AdminOnly")]
        [Authorize]
        public IActionResult DeleteItem(int id)
        {
            Item item = _itemRepository.GetBy(id);
            if (item == null)
            {
                return NotFound();
            }
            _itemRepository.Delete(item);
            _itemRepository.SaveChanges();
            return NoContent();
        }
    }
}
