using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StorePilot.DTOs.Carts;
using StorePilot.Services.Interfaces;

namespace StorePilot.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Customer")]
public class CartsController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartsController(ICartService cartService)
    {
        _cartService = cartService;
    }

    // GET: api/Carts
    [HttpGet]
    public async Task<ActionResult<CartResponseDto>> GetMyCart()
    {
        var userId = GetCurrentUserId();

        var cart = await _cartService.GetMyCartAsync(userId);

        return Ok(cart);
    }

    // POST: api/Carts/items
    [HttpPost("items")]
    public async Task<ActionResult<CartResponseDto>> AddItem(
        AddCartItemDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();

            var cart = await _cartService.AddItemAsync(userId, dto);

            return Ok(cart);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT: api/Carts/items/{itemId}
    [HttpPut("items/{itemId}")]
    public async Task<ActionResult<CartResponseDto>> UpdateItem(
        int itemId,
        UpdateCartItemDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();

            var cart = await _cartService.UpdateItemAsync(
                userId,
                itemId,
                dto);

            return Ok(cart);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // DELETE: api/Carts/items/{itemId}
    [HttpDelete("items/{itemId}")]
    public async Task<IActionResult> RemoveItem(int itemId)
    {
        try
        {
            var userId = GetCurrentUserId();

            await _cartService.RemoveItemAsync(userId, itemId);

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // DELETE: api/Carts
    [HttpDelete]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetCurrentUserId();

        await _cartService.ClearCartAsync(userId);

        return NoContent();
    }

    // Get authenticated user's ID from JWT claims
    private int GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var id))
            throw new UnauthorizedAccessException();

        return id;
    }
}