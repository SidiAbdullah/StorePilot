namespace StorePilot.DTOs.Orders;

public class OrderResponseDto
{
    public int Id { get; set; }

    public string OrderNumber { get; set; } = string.Empty;

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerEmail { get; set; } = string.Empty;

    public string CustomerPhone { get; set; } = string.Empty;

    public string ShippingAddress { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    public string Status { get; set; } = string.Empty;

    public string PaymentMethod { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public ICollection<OrderItemResponseDto> Items { get; set; }
        = new List<OrderItemResponseDto>();
}