using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GlennLuna.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddKidDesignOffersAndSaleFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "AskingPrice",
                table: "KidDesignSubmissions",
                type: "decimal(10,2)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsForSale",
                table: "KidDesignSubmissions",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SaleCurrency",
                table: "KidDesignSubmissions",
                type: "varchar(3)",
                maxLength: 3,
                nullable: false,
                defaultValue: "CAD")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "KidDesignOffers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    KidDesignSubmissionId = table.Column<int>(type: "int", nullable: false),
                    BuyerName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BuyerEmail = table.Column<string>(type: "varchar(256)", maxLength: 256, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OfferAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Currency = table.Column<string>(type: "varchar(3)", maxLength: 3, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Message = table.Column<string>(type: "varchar(1200)", maxLength: 1200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<string>(type: "varchar(30)", maxLength: 30, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAtUtc = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ReviewedAtUtc = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ReviewerUserId = table.Column<string>(type: "varchar(450)", maxLength: 450, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KidDesignOffers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KidDesignOffers_AspNetUsers_ReviewerUserId",
                        column: x => x.ReviewerUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_KidDesignOffers_KidDesignSubmissions_KidDesignSubmissionId",
                        column: x => x.KidDesignSubmissionId,
                        principalTable: "KidDesignSubmissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_KidDesignOffers_KidDesignSubmissionId",
                table: "KidDesignOffers",
                column: "KidDesignSubmissionId");

            migrationBuilder.CreateIndex(
                name: "IX_KidDesignOffers_ReviewerUserId",
                table: "KidDesignOffers",
                column: "ReviewerUserId");

            migrationBuilder.CreateIndex(
                name: "IX_KidDesignOffers_Status",
                table: "KidDesignOffers",
                column: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KidDesignOffers");

            migrationBuilder.DropColumn(
                name: "AskingPrice",
                table: "KidDesignSubmissions");

            migrationBuilder.DropColumn(
                name: "IsForSale",
                table: "KidDesignSubmissions");

            migrationBuilder.DropColumn(
                name: "SaleCurrency",
                table: "KidDesignSubmissions");
        }
    }
}
