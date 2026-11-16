using Microsoft.EntityFrameworkCore;
using StorePilot.Data;
using StorePilot.DTOs.Categories;
using StorePilot.Models;
using StorePilot.Services.Interfaces;

namespace StorePilot.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly StorePilotDbContext _context;

    public CategoryService(StorePilotDbContext context)
    {
        _context = context;
    }

    // Get all categories
    public async Task<IEnumerable<CategoryResponseDto>> GetAllAsync()
    {
        var categories = await _context.Categories
            .AsNoTracking()
            .ToListAsync();

        return categories.Select(MapToResponseDto);
    }

    // Get category by ID
    public async Task<CategoryResponseDto?> GetByIdAsync(int id)
    {
        var category = await _context.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        return category == null ? null : MapToResponseDto(category);
    }

    // Create category
    public async Task<CategoryResponseDto> CreateAsync(CreateCategoryDto dto)
    {
        var category = new Category
        {
            Name = dto.Name,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        _context.Categories.Add(category);

        await _context.SaveChangesAsync();

        return MapToResponseDto(category);
    }

    // Update category
    public async Task<CategoryResponseDto?> UpdateAsync(
        int id,
        UpdateCategoryDto dto)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
            return null;

        category.Name = dto.Name;
        category.Description = dto.Description;

        await _context.SaveChangesAsync();

        return MapToResponseDto(category);
    }

    // Delete category
    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
            return false;

        _context.Categories.Remove(category);

        await _context.SaveChangesAsync();

        return true;
    }

    // Map Entity to DTO
    private static CategoryResponseDto MapToResponseDto(Category category)
    {
        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            CreatedAt = category.CreatedAt
        };
    }
}