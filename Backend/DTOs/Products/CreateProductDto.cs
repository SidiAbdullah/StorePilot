using System.ComponentModel.DataAnnotations;

namespace StorePilot.DTOs.Products;

public class CreateProductDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(50)]
    public string SKU { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Description { get; set; }

    [Range(0.01, 999999999)]
    public decimal Price { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [Range(1, int.MaxValue)]
    public int? CategoryId { get; set; }
}