namespace StorePilot.DTOs.Carts;

public class CartItemResponseDto
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public string SKU { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    public decimal TotalPrice { get; set; }
}

public class CartResponseDto
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public int TotalItems { get; set; }

    public decimal TotalPrice { get; set; }

    public ICollection<CartItemResponseDto> Items { get; set; }
        = new List<CartItemResponseDto>();
}