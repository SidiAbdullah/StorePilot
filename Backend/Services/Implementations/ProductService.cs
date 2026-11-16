using Microsoft.EntityFrameworkCore;
using StorePilot.Data;
using StorePilot.DTOs.Products;
using StorePilot.Models;
using StorePilot.Services.Interfaces;

namespace StorePilot.Services.Implementations;

public class ProductService : IProductService
{
    private readonly StorePilotDbContext _context;

    public ProductService(StorePilotDbContext context)
    {
        _context = context;
    }

    // Get all products
    public async Task<IEnumerable<ProductResponseDto>> GetAllAsync()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .ToListAsync();

        return products.Select(MapToResponseDto);
    }

    // Get product by ID
    public async Task<ProductResponseDto?> GetByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        return product == null ? null : MapToResponseDto(product);
    }

    // Create product
    public async Task<ProductResponseDto> CreateAsync(CreateProductDto dto)
    {
        var skuExists = await _context.Products
            .AnyAsync(p => p.SKU == dto.SKU);

        if (skuExists)
            throw new InvalidOperationException("A product with this SKU already exists.");

        if (dto.CategoryId.HasValue)
        {
            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == dto.CategoryId.Value);

            if (!categoryExists)
                throw new InvalidOperationException("Category not found.");
        }

        var product = new Product
        {
            Name = dto.Name,
            SKU = dto.SKU,
            Description = dto.Description,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl,
            MinimumStockLevel = dto.MinimumStockLevel,
            CategoryId = dto.CategoryId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        await _context.Entry(product)
            .Reference(p => p.Category)
            .LoadAsync();

        return MapToResponseDto(product);
    }

    // Update product
    public async Task<ProductResponseDto?> UpdateAsync(
        int id,
        UpdateProductDto dto)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return null;

        var skuExists = await _context.Products
            .AnyAsync(p => p.SKU == dto.SKU && p.Id != id);

        if (skuExists)
            throw new InvalidOperationException("A product with this SKU already exists.");

        if (dto.CategoryId.HasValue)
        {
            var categoryExists = await _context.Categories
                .AnyAsync(c => c.Id == dto.CategoryId.Value);

            if (!categoryExists)
                throw new InvalidOperationException("Category not found.");
        }

        product.Name = dto.Name;
        product.SKU = dto.SKU;
        product.Description = dto.Description;
        product.Price = dto.Price;
        product.ImageUrl = dto.ImageUrl;
        product.MinimumStockLevel = dto.MinimumStockLevel;
        product.CategoryId = dto.CategoryId;
        product.IsActive = dto.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _context.Entry(product)
            .Reference(p => p.Category)
            .LoadAsync();

        return MapToResponseDto(product);
    }

    // Soft delete product
    public async Task<bool> DeleteAsync(int id)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return false;

        product.IsActive = false;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    // Map Entity to DTO
    private static ProductResponseDto MapToResponseDto(Product product)
    {
        return new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            SKU = product.SKU,
            Description = product.Description,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            MinimumStockLevel = product.MinimumStockLevel,
            IsActive = product.IsActive,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name
        };
    }
}