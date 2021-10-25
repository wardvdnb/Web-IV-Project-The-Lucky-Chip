using System.ComponentModel.DataAnnotations;

namespace Api.DTOs
{
    public class LoginDTO
    {
        [Required]
        [StringLength(250)]
        public string NickName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
