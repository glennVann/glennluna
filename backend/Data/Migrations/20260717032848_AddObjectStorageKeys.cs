using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GlennLuna.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddObjectStorageKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DesignFileObjectKey",
                table: "KidDesignSubmissions",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SubmissionFileObjectKey",
                table: "ContentTasks",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageObjectKey",
                table: "AspNetUsers",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DesignFileObjectKey",
                table: "KidDesignSubmissions");

            migrationBuilder.DropColumn(
                name: "SubmissionFileObjectKey",
                table: "ContentTasks");

            migrationBuilder.DropColumn(
                name: "ProfileImageObjectKey",
                table: "AspNetUsers");
        }
    }
}
