using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Api.Models;
using Api.DTOs;
using Api.Data.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiConventionType(typeof(DefaultApiConventions))]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class AccountController : ControllerBase
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IPlayerRepository _playerRepository;
        private readonly IItemRepository _itemRepository;
        private readonly IConfiguration _config;

        public AccountController(
          SignInManager<IdentityUser> signInManager,
          UserManager<IdentityUser> userManager,
          IPlayerRepository playerRepository,
          IItemRepository itemRepository,
          IConfiguration config)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _playerRepository = playerRepository;
            _itemRepository = itemRepository;
            _config = config;
        }

        /// <summary>
        /// Login
        /// </summary>
        /// <param name="model">the login details</param>
        /// play around with JWT : jwt.io, zie SL96 Rest Api
        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<String>> CreateToken(LoginDTO model)
        {
            var user = await _userManager.FindByNameAsync(model.NickName);

            if (user != null)
            {
                var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

                if (result.Succeeded)
                {
                    string token = GetToken(user);
                    return Created("", token); //returns only the token                    
                }
            }
            return BadRequest();
        }

        /// <summary>
        /// Register a user
        /// </summary>
        /// <param name="model">the user details</param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<String>> Register(RegisterDTO model)
        {
            IdentityUser user = new IdentityUser { UserName = model.NickName, Email = model.Email };
            Player player = new Player { Email = model.Email, NickName = model.NickName, Money = 1000};
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                _playerRepository.Add(player);
                _playerRepository.SaveChanges();
                string token = GetToken(user);
                return Created("", token);
            }
            return BadRequest();
        }

        /// <summary>
        /// Checks if a username is available
        /// </summary>
        /// <returns>true if the nickname is not registered yet</returns>
        [AllowAnonymous]
        [HttpGet("checkusername")]
        public async Task<ActionResult<Boolean>> CheckAvailableUserName(string nickname)
        {
            var user = await _userManager.FindByNameAsync(nickname);
            return user == null;
        }

        /// <summary>
        /// Get amount money in current user's account
        /// </summary>
        [HttpGet("getmoney")]
        [Authorize]
        public int GetMoney()
        {
            Player player = _playerRepository.GetBy(User.Identity.Name);
            return player.Money;
        }

        [HttpPut("updatemoney/{money}")]
        [Authorize]
        public int UpdateMoney(int money)
        {
            Player player = _playerRepository.GetBy(User.Identity.Name);
            player.Money = money;
            _playerRepository.SaveChanges();
            return player.Money;
        }

        [HttpPost("buyitem/{id}")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public ActionResult<Item> BuyItem(int id)
        {
            Item item = _itemRepository.GetBy(id);
            Player player = _playerRepository.GetBy(User.Identity.Name);
            if(item.Price > player.Money)
            {
                return BadRequest();
            }
            player.AddBoughtItem(item);
            player.IncrementMoney(-item.Price);
            _playerRepository.SaveChanges();
            return item;
        }

        // GET: api/Account/Items
        /// <summary>
        /// Get all items ordered by name of the current user
        /// </summary>
        /// <returns>All Items</returns>
        [HttpGet("getitems")]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize]
        //OPMERKING: [ApiConventionType(typeof(DefaultApiConventions))] bovenaan de controller als alternatief voor individuele response types
        public ActionResult<IEnumerable<Item>> GetItems()
        {
            Player player = _playerRepository.GetBy(User.Identity.Name);
            if (player.Items == null)
                return StatusCode(StatusCodes.Status500InternalServerError);
            IEnumerable<Item> items = player.BoughtItems.OrderBy(r => r.Name).ToList();
            return Ok(items);
        }


        // POST: api/Account/additem
        /// <summary>
        /// Adds a new item to the user's collection
        /// </summary>
        /// <param name="item">the new item</param>
        [HttpPost("additem")]
        [Authorize]
        public ActionResult<Item> AddItem(Item itemToAdd)
        {
            //Item itemToAdd = new Item() { Name = item.Name, Price = item.Price };
            Player player = _playerRepository.GetBy(User.Identity.Name);
            player.AddBoughtItem(itemToAdd);
            _playerRepository.SaveChanges();

            return itemToAdd;
        }

        private String GetToken(IdentityUser user)
        {
            // Create the token
            var claims = new[]
            {
              new Claim(JwtRegisteredClaimNames.Sub, user.Email),
              new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Tokens:Key"]));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
              null, null,
              claims,
              expires: DateTime.Now.AddMinutes(30),
              signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}