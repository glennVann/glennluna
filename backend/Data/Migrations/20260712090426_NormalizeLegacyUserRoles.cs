using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GlennLuna.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class NormalizeLegacyUserRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "UPDATE `AspNetUsers` SET `Role` = 'User' WHERE TRIM(`Role`) = '';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // The previous blank values cannot be identified safely after normalization.
        }
    }
}
