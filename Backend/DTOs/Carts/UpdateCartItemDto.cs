using System.ComponentModel.DataAnnotations;

namespace StorePilot.DTOs.Carts;

public class UpdateCartItemDto
{
    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}