using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using StorePilot.DTOs.Categories;
using StorePilot.Services.Interfaces;

namespace StorePilot.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // GET: api/categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryResponseDto>>> GetAll()
    {
        var categories = await _categoryService.GetAllAsync();

        return Ok(categories);
    }

    // GET: api/categories/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryResponseDto>> GetById(int id)
    {
        var category = await _categoryService.GetByIdAsync(id);

        if (category == null)
            return NotFound(new { message = "Category not found." });

        return Ok(category);
    }

    // POST: api/categories
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryResponseDto>> Create(
        CreateCategoryDto dto)
    {
        var category = await _categoryService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = category.Id },
            category);
    }

    // PUT: api/categories/5
    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryResponseDto>> Update(
        int id,
        UpdateCategoryDto dto)
    {
        var category = await _categoryService.UpdateAsync(id, dto);

        if (category == null)
            return NotFound(new { message = "Category not found." });

        return Ok(category);
    }

    // DELETE: api/categories/5
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _categoryService.DeleteAsync(id);

        if (!deleted)
            return NotFound(new { message = "Category not found." });

        return NoContent();
    }
}