using Microsoft.EntityFrameworkCore;
using StorePilot.Data;
using StorePilot.DTOs.Carts;
using StorePilot.Models;
using StorePilot.Services.Interfaces;

namespace StorePilot.Services.Implementations;

public class CartService : ICartService
{
    private readonly StorePilotDbContext _context;

    public CartService(StorePilotDbContext context)
    {
        _context = context;
    }

    // Get the current user's cart
    public async Task<CartResponseDto> GetMyCartAsync(int userId)
    {
        var cart = await GetOrCreateCartAsync(userId);

        return MapToResponseDto(cart);
    }

    // Add a product to the cart
    public async Task<CartResponseDto> AddItemAsync(
        int userId,
        AddCartItemDto dto)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(p => p.Id == dto.ProductId);

        if (product == null)
            throw new KeyNotFoundException("Product not found.");

        if (!product.IsActive)
            throw new InvalidOperationException(
                "This product is currently unavailable.");

        var cart = await GetOrCreateCartAsync(userId);

        var existingItem = cart.Items
            .FirstOrDefault(i => i.ProductId == dto.ProductId);

        if (existingItem != null)
        {
            existingItem.Quantity += dto.Quantity;
        }
        else
        {
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = product.Id,
                Quantity = dto.Quantity
            };

            cart.Items.Add(cartItem);
        }

        await _context.SaveChangesAsync();

        // Reload the cart with updated product information
        cart = await GetCartWithItemsAsync(userId);

        return MapToResponseDto(cart);
    }

    // Update an existing cart item's quantity
    public async Task<CartResponseDto> UpdateItemAsync(
        int userId,
        int itemId,
        UpdateCartItemDto dto)
    {
        var cart = await GetCartWithItemsAsync(userId);

        var item = cart.Items
            .FirstOrDefault(i => i.Id == itemId);

        if (item == null)
            throw new KeyNotFoundException("Cart item not found.");

        item.Quantity = dto.Quantity;

        await _context.SaveChangesAsync();

        return MapToResponseDto(cart);
    }

    // Remove one item from the cart
    public async Task RemoveItemAsync(int userId, int itemId)
    {
        var cart = await GetCartWithItemsAsync(userId);

        var item = cart.Items
            .FirstOrDefault(i => i.Id == itemId);

        if (item == null)
            throw new KeyNotFoundException("Cart item not found.");

        _context.CartItems.Remove(item);

        await _context.SaveChangesAsync();
    }

    // Remove all items from the cart
    public async Task ClearCartAsync(int userId)
    {
        var cart = await GetCartWithItemsAsync(userId);

        _context.CartItems.RemoveRange(cart.Items);

        await _context.SaveChangesAsync();
    }

    // Find the user's cart or create a new one
    private async Task<Cart> GetOrCreateCartAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart != null)
            return cart;

        cart = new Cart
        {
            UserId = userId
        };

        _context.Carts.Add(cart);

        await _context.SaveChangesAsync();

        return cart;
    }

    // Get the user's cart with all its items and products
    private async Task<Cart> GetCartWithItemsAsync(int userId)
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == userId);

        if (cart == null)
            throw new KeyNotFoundException("Cart not found.");

        return cart;
    }

    // Map Cart entity to CartResponseDto
    private static CartResponseDto MapToResponseDto(Cart cart)
    {
        var items = cart.Items.Select(item =>
            new CartItemResponseDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product.Name,
                SKU = item.Product.SKU,
                ImageUrl = item.Product.ImageUrl,
                UnitPrice = item.Product.Price,
                Quantity = item.Quantity,
                TotalPrice = item.Product.Price * item.Quantity
            }).ToList();

        return new CartResponseDto
        {
            Id = cart.Id,
            CreatedAt = cart.CreatedAt,
            TotalItems = items.Sum(i => i.Quantity),
            TotalPrice = items.Sum(i => i.TotalPrice),
            Items = items
        };
    }
}