using Microsoft.EntityFrameworkCore;
using StorePilot.Data;
using StorePilot.DTOs.Users;
using StorePilot.Models;
using StorePilot.Services.Interfaces;

namespace StorePilot.Services.Implementations;

public class UserService : IUserService
{
    private readonly StorePilotDbContext _context;

    public UserService(StorePilotDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
    {
        var users = await _context.Users
            .OrderBy(u => u.Id)
            .ToListAsync();

        return users.Select(MapToResponseDto);
    }

    public async Task<UserResponseDto?> GetByIdAsync(int id)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return null;

        return MapToResponseDto(user);
    }

    public async Task<UserResponseDto> UpdateRoleAsync(
        int id,
        string role,
        int currentUserId)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        if (id == currentUserId)
            throw new InvalidOperationException(
                "You cannot change your own role.");

        var allowedRoles = new[] { "Admin", "Customer", "Employee" };

        if (!allowedRoles.Contains(role, StringComparer.OrdinalIgnoreCase))
            throw new InvalidOperationException("Invalid role.");

        role = allowedRoles.First(r =>
            r.Equals(role, StringComparison.OrdinalIgnoreCase));

        if (user.Role == "Admin" && role != "Admin")
        {
            var adminCount = await _context.Users
                .CountAsync(u => u.Role == "Admin");

            if (adminCount <= 1)
                throw new InvalidOperationException(
                    "You cannot remove the last Admin.");
        }

        user.Role = role;

        await _context.SaveChangesAsync();

        return MapToResponseDto(user);
    }

    public async Task DeleteAsync(int id, int currentUserId)
    {
        var user = await _context.Users
            .Include(u => u.Orders)
            .Include(u => u.Carts)
            .Include(u => u.StockMovements)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        if (id == currentUserId)
            throw new InvalidOperationException(
                "You cannot delete your own account.");

        if (user.Role == "Admin")
        {
            var adminCount = await _context.Users
                .CountAsync(u => u.Role == "Admin");

            if (adminCount <= 1)
                throw new InvalidOperationException(
                    "You cannot delete the last Admin.");
        }

        if (user.Orders.Any() ||
            user.Carts.Any() ||
            user.StockMovements.Any())
        {
            throw new InvalidOperationException(
                "Cannot delete this user because they have related records.");
        }

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();
    }

    private static UserResponseDto MapToResponseDto(User user)
    {
        return new UserResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            CreatedAt = user.CreatedAt
        };
    }
}