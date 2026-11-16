using StorePilot.DTOs.Carts;

namespace StorePilot.Services.Interfaces;

public interface ICartService
{
    Task<CartResponseDto> GetMyCartAsync(int userId);

    Task<CartResponseDto> AddItemAsync(
        int userId,
        AddCartItemDto dto);

    Task<CartResponseDto> UpdateItemAsync(
        int userId,
        int itemId,
        UpdateCartItemDto dto);

    Task RemoveItemAsync(int userId, int itemId);

    Task ClearCartAsync(int userId);
}