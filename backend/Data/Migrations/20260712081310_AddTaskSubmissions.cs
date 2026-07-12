using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GlennLuna.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskSubmissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "SubmissionFile",
                table: "ContentTasks",
                type: "longblob",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubmissionFileContentType",
                table: "ContentTasks",
                type: "varchar(100)",
                maxLength: 100,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SubmissionFileName",
                table: "ContentTasks",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SubmissionLink",
                table: "ContentTasks",
                type: "varchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SubmissionNotes",
                table: "ContentTasks",
                type: "varchar(2000)",
                maxLength: 2000,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SubmissionText",
                table: "ContentTasks",
                type: "varchar(10000)",
                maxLength: 10000,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedAtUtc",
                table: "ContentTasks",
                type: "datetime(6)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubmissionFile",
                table: "ContentTasks");

            migrationBuilder.DropColumn(
                name: "SubmissionFileContentType",
                table: "ContentTasks");

            migrationBuilder.DropColumn(
                name: "SubmissionFileName",
                table: "ContentTasks");

            migrationBuilder.DropColumn(
                name: "SubmissionLink",
                table: "ContentTasks");

            migrationBuilder.DropColumn(
                name: "SubmissionNotes",
                table: "ContentTasks");

            migrationBuilder.DropColumn(
                name: "SubmissionText",
                table: "ContentTasks");

            migrationBuilder.DropColumn(
                name: "SubmittedAtUtc",
                table: "ContentTasks");
        }
    }
}
