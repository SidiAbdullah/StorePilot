using StorePilot.DTOs.Orders;

namespace StorePilot.Services.Interfaces;

public interface IOrderService
{
    Task<OrderResponseDto> CheckoutAsync(
        int userId,
        CheckoutOrderDto dto);

    Task<IReadOnlyList<OrderResponseDto>> GetMyOrdersAsync(
        int userId);

    Task<OrderResponseDto?> GetMyOrderByIdAsync(
        int userId,
        int orderId);
}