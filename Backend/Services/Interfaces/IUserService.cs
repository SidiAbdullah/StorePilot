using StorePilot.DTOs.Users;

namespace StorePilot.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> GetAllAsync();

    Task<UserResponseDto?> GetByIdAsync(int id);

    Task<UserResponseDto> UpdateRoleAsync(
        int id,
        string role,
        int currentUserId);

    Task DeleteAsync(int id, int currentUserId);
}