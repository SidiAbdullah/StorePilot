using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StorePilot.DTOs.Users;
using StorePilot.Services.Interfaces;

namespace StorePilot.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAll()
    {
        var users = await _userService.GetAllAsync();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserResponseDto>> GetById(int id)
    {
        var user = await _userService.GetByIdAsync(id);

        if (user == null)
            return NotFound(new { message = "User not found." });

        return Ok(user);
    }

    [HttpPut("{id}/role")]
    public async Task<ActionResult<UserResponseDto>> UpdateRole(
        int id,
        UpdateUserRoleDto dto)
    {
        try
        {
            var currentUserId = GetCurrentUserId();

            var updatedUser = await _userService.UpdateRoleAsync(
                id,
                dto.Role,
                currentUserId);

            return Ok(updatedUser);
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var currentUserId = GetCurrentUserId();

            await _userService.DeleteAsync(id, currentUserId);

            return NoContent();
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

    private int GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userId, out var id))
            throw new UnauthorizedAccessException();

        return id;
    }
}