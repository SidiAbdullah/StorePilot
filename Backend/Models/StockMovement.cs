using StorePilot.Models.Enums;

namespace StorePilot.Models;

public class StockMovement
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int WarehouseId { get; set; }
    public int? UserId { get; set; }
    public MovementType MovementType { get; set; }
    public int Quantity { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Product Product { get; set; } = null!;
    public Warehouse Warehouse { get; set; } = null!;
    public User? User { get; set; }
}