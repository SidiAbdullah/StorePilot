using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StorePilot.DTOs.Orders;
using StorePilot.Services.Interfaces;

namespace StorePilot.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    // POST: api/Orders/checkout
    [Authorize(Roles = "Customer")]
    [HttpPost("checkout")]
    public async Task<ActionResult<OrderResponseDto>> Checkout(
        CheckoutOrderDto dto)
    {
        try
        {
            var userId = GetCurrentUserId();

            var order = await _orderService.CheckoutAsync(
                userId,
                dto);

            return CreatedAtAction(
                nameof(GetMyOrderById),
                new { orderId = order.Id },
                order);
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

    // GET: api/Orders/my
    [Authorize(Roles = "Customer")]
    [HttpGet("my")]
    public async Task<ActionResult<IReadOnlyList<OrderResponseDto>>> GetMyOrders()
    {
        var userId = GetCurrentUserId();

        var orders = await _orderService.GetMyOrdersAsync(userId);

        return Ok(orders);
    }

    // GET: api/Orders/5
    [Authorize(Roles = "Customer")]
    [HttpGet("{orderId:int}")]
    public async Task<ActionResult<OrderResponseDto>> GetMyOrderById(
        int orderId)
    {
        var userId = GetCurrentUserId();

        var order = await _orderService.GetMyOrderByIdAsync(
            userId,
            orderId);

        if (order == null)
            return NotFound(new { message = "Order not found." });

        return Ok(order);
    }

// GET: api/Orders/all
[Authorize(Roles = "Admin")]
[HttpGet("all")]
public async Task<ActionResult<IReadOnlyList<OrderResponseDto>>> GetAllOrders()
{
    var orders = await _orderService.GetAllOrdersAsync();

    return Ok(orders);
}

    private int GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var id))
            throw new UnauthorizedAccessException();

        return id;
    }
}