using Microsoft.EntityFrameworkCore;
using StorePilot.Models;
using StorePilot.Models.Enums;
using System.Reflection.Emit;

namespace StorePilot.Data;

public class StorePilotDbContext : DbContext
{
    public StorePilotDbContext(DbContextOptions<StorePilotDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Warehouse> Warehouses => Set<Warehouse>();
    public DbSet<Inventory> Inventory => Set<Inventory>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();

            entity.Property(u => u.Username).HasMaxLength(50).IsRequired();
            entity.Property(u => u.Email).HasMaxLength(100).IsRequired();
            entity.Property(u => u.PasswordHash).HasMaxLength(255).IsRequired();
            entity.Property(u => u.Role).HasMaxLength(20).IsRequired();
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(c => c.Name).IsUnique();
            entity.Property(c => c.Name).HasMaxLength(100).IsRequired();
            entity.Property(c => c.Description).HasMaxLength(500);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasIndex(p => p.SKU).IsUnique();

            entity.Property(p => p.Name).HasMaxLength(100).IsRequired();
            entity.Property(p => p.SKU).HasMaxLength(50).IsRequired();
            entity.Property(p => p.Description).HasMaxLength(1000);
            entity.Property(p => p.ImageUrl).HasMaxLength(500);
            entity.Property(p => p.Price).HasPrecision(18, 2);

            entity.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Inventory>(entity =>
        {
            entity.HasIndex(i => new { i.ProductId, i.WarehouseId }).IsUnique();

            entity.HasOne(i => i.Product)
                .WithMany(p => p.Inventories)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(i => i.Warehouse)
                .WithMany(w => w.Inventories)
                .HasForeignKey(i => i.WarehouseId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<StockMovement>(entity =>
        {
            entity.Property(sm => sm.MovementType)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.HasOne(sm => sm.Product)
                .WithMany(p => p.StockMovements)
                .HasForeignKey(sm => sm.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(sm => sm.Warehouse)
                .WithMany(w => w.StockMovements)
                .HasForeignKey(sm => sm.WarehouseId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(sm => sm.User)
                .WithMany(u => u.StockMovements)
                .HasForeignKey(sm => sm.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasIndex(c => c.GuestToken)
                .IsUnique()
                .HasFilter("[GuestToken] IS NOT NULL");

            entity.HasOne(c => c.User)
                .WithMany(u => u.Carts)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasIndex(ci => new { ci.CartId, ci.ProductId }).IsUnique();

            entity.HasOne(ci => ci.Cart)
                .WithMany(c => c.Items)
                .HasForeignKey(ci => ci.CartId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(ci => ci.Product)
                .WithMany(p => p.CartItems)
                .HasForeignKey(ci => ci.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasIndex(o => o.OrderNumber).IsUnique();
            entity.HasIndex(o => o.UserId);
            entity.HasIndex(o => o.CreatedAt);

            entity.Property(o => o.OrderNumber).HasMaxLength(50).IsRequired();
            entity.Property(o => o.CustomerName).HasMaxLength(150).IsRequired();
            entity.Property(o => o.CustomerEmail).HasMaxLength(100).IsRequired();
            entity.Property(o => o.CustomerPhone).HasMaxLength(30).IsRequired();
            entity.Property(o => o.ShippingAddress).HasMaxLength(500).IsRequired();
            entity.Property(o => o.TotalAmount).HasPrecision(18, 2);
            entity.Property(o => o.Status).HasMaxLength(30).IsRequired();
            entity.Property(o => o.PaymentMethod).HasMaxLength(30).IsRequired();

            entity.HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.Property(oi => oi.ProductName).HasMaxLength(100).IsRequired();
            entity.Property(oi => oi.UnitPrice).HasPrecision(18, 2);
            entity.Property(oi => oi.Subtotal).HasPrecision(18, 2);

            entity.HasIndex(oi => oi.ProductId);

            entity.HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(oi => oi.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}