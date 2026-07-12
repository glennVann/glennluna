using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GlennLuna.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTeamPhotoSource : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "UseAccountProfileImage",
                table: "TeamMembers",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "TeamMembers",
                keyColumn: "Id",
                keyValue: 1,
                column: "UseAccountProfileImage",
                value: false);

            migrationBuilder.UpdateData(
                table: "TeamMembers",
                keyColumn: "Id",
                keyValue: 2,
                column: "UseAccountProfileImage",
                value: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UseAccountProfileImage",
                table: "TeamMembers");
        }
    }
}
