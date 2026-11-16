namespace StorePilot.DTOs.Products;

public class ProductResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SKU { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int MinimumStockLevel { get; set; }
    public bool IsActive { get; set; }
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }
}