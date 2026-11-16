using System.ComponentModel.DataAnnotations;

namespace StorePilot.DTOs.Orders;

public class CheckoutOrderDto
{
    [Required]
    [MaxLength(300)]
    public string CustomerName { get; set; } = string.Empty;

    [Required]
    [MaxLength(60)]
    public string CustomerPhone { get; set; } = string.Empty;

    [Required]
    [MaxLength(1000)]
    public string ShippingAddress { get; set; } = string.Empty;
}