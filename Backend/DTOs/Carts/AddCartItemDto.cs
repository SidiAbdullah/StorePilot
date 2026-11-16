using System.ComponentModel.DataAnnotations;

namespace StorePilot.DTOs.Carts;

public class AddCartItemDto
{
    [Required]
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}