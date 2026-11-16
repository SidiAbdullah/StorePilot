namespace StorePilot.Models;

public class Order
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string OrderNumber { get; set; } = string.Empty;

    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string ShippingAddress { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = "Pending";
    public string PaymentMethod { get; set; } = "CashOnDelivery";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}