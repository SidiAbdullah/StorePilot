using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StorePilot.Migrations
{
    public partial class RemoveObsoleteInventoryTables : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StockMovements");

            migrationBuilder.DropTable(
                name: "Inventory");

            migrationBuilder.DropTable(
                name: "Warehouses");

            migrationBuilder.DropCheckConstraint(
                name: "CK_Products_MinimumStock",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinimumStockLevel",
                table: "Products");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            throw new NotSupportedException(
                "This migration permanently removes obsolete inventory data and cannot be safely reversed.");
        }
    }
}