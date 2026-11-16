using Microsoft.EntityFrameworkCore;
using StorePilot.Data;
using StorePilot.DTOs.Orders;
using StorePilot.Models;
using StorePilot.Models.Enums;
using StorePilot.Services.Interfaces;
using System.Data;

namespace StorePilot.Services.Implementations;

public class OrderService : IOrderService
{
    private readonly StorePilotDbContext _context;

    public OrderService(StorePilotDbContext context)
    {
        _context = context;
    }

    // Checkout
    public async Task<OrderResponseDto> CheckoutAsync(
        int userId,
        CheckoutOrderDto dto)
    {
        await using var transaction =
            await _context.Database.BeginTransactionAsync(
                IsolationLevel.Serializable);

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        var cart = await _context.Carts
            .Include(c => c.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null || !cart.Items.Any())
            throw new InvalidOperationException("Your cart is empty.");

        var order = new Order
        {
            UserId = userId,
            OrderNumber = $"SP-{Guid.NewGuid():N}",
            CustomerName = dto.CustomerName,
            CustomerEmail = user.Email,
            CustomerPhone = dto.CustomerPhone,
            ShippingAddress = dto.ShippingAddress,
            Status = "Pending",
            PaymentMethod = "CashOnDelivery",
            CreatedAt = DateTime.UtcNow
        };

        var stockMovements = new List<StockMovement>();

        decimal totalAmount = 0;

        foreach (var cartItem in cart.Items)
        {
            var product = cartItem.Product;

            if (!product.IsActive)
            {
                throw new InvalidOperationException(
                    $"Product '{product.Name}' is unavailable.");
            }

            var inventories = await _context.Inventory
                .Where(i => i.ProductId == product.Id && i.Quantity > 0)
                .OrderBy(i => i.Id)
                .ToListAsync();

            long availableQuantity = inventories.Sum(
                i => (long)i.Quantity);

            if (availableQuantity < cartItem.Quantity)
            {
                throw new InvalidOperationException(
                    $"Insufficient stock for '{product.Name}'. " +
                    $"Available: {availableQuantity}, " +
                    $"Requested: {cartItem.Quantity}.");
            }

            var remainingQuantity = cartItem.Quantity;

            foreach (var inventory in inventories)
            {
                if (remainingQuantity == 0)
                    break;

                var quantityToDeduct = Math.Min(
                    inventory.Quantity,
                    remainingQuantity);

                inventory.Quantity -= quantityToDeduct;
                inventory.LastUpdated = DateTime.UtcNow;

                stockMovements.Add(new StockMovement
                {
                    ProductId = product.Id,
                    WarehouseId = inventory.WarehouseId,
                    UserId = userId,
                    MovementType = MovementType.StockOut,
                    Quantity = quantityToDeduct,
                    CreatedAt = DateTime.UtcNow
                });

                remainingQuantity -= quantityToDeduct;
            }

            var subtotal = product.Price * cartItem.Quantity;

            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                UnitPrice = product.Price,
                Quantity = cartItem.Quantity,
                Subtotal = subtotal
            });

            totalAmount += subtotal;
        }

        order.TotalAmount = totalAmount;

        _context.Orders.Add(order);

        _context.StockMovements.AddRange(stockMovements);

        _context.CartItems.RemoveRange(cart.Items);

        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        return MapToResponseDto(order);
    }

    // Get all orders belonging to the authenticated customer
    public async Task<IReadOnlyList<OrderResponseDto>> GetMyOrdersAsync(
        int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(MapToResponseDto).ToList();
    }

    // Get one order belonging to the authenticated customer
    public async Task<OrderResponseDto?> GetMyOrderByIdAsync(
        int userId,
        int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o =>
                o.Id == orderId &&
                o.UserId == userId);

        if (order == null)
            return null;

        return MapToResponseDto(order);
    }

    // Map Order entity to response DTO
    private static OrderResponseDto MapToResponseDto(Order order)
    {
        return new OrderResponseDto
        {
            Id = order.Id,
            OrderNumber = order.OrderNumber,
            CustomerName = order.CustomerName,
            CustomerEmail = order.CustomerEmail,
            CustomerPhone = order.CustomerPhone,
            ShippingAddress = order.ShippingAddress,
            TotalAmount = order.TotalAmount,
            Status = order.Status,
            PaymentMethod = order.PaymentMethod,
            CreatedAt = order.CreatedAt,

            Items = order.Items.Select(item =>
                new OrderItemResponseDto
                {
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductName = item.ProductName,
                    UnitPrice = item.UnitPrice,
                    Quantity = item.Quantity,
                    Subtotal = item.Subtotal
                }).ToList()
        };
    }
}