using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HHBAspire.ApiService.Migrations
{
    /// <inheritdoc />
    public partial class FixMinistryMappingMakeInfoApiOwned : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ministries_Ministries_MinistryObjectId",
                table: "Ministries");

            migrationBuilder.RenameColumn(
                name: "MinistryObjectId",
                table: "Ministries",
                newName: "ParentId");

            migrationBuilder.RenameIndex(
                name: "IX_Ministries_MinistryObjectId",
                table: "Ministries",
                newName: "IX_Ministries_ParentId");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Ministries",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Ministries_SiteInfoId_ParentId",
                table: "Ministries",
                columns: new[] { "SiteInfoId", "ParentId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Ministries_Ministries_ParentId",
                table: "Ministries",
                column: "ParentId",
                principalTable: "Ministries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ministries_Ministries_ParentId",
                table: "Ministries");

            migrationBuilder.DropIndex(
                name: "IX_Ministries_SiteInfoId_ParentId",
                table: "Ministries");

            migrationBuilder.RenameColumn(
                name: "ParentId",
                table: "Ministries",
                newName: "MinistryObjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Ministries_ParentId",
                table: "Ministries",
                newName: "IX_Ministries_MinistryObjectId");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Ministries",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddForeignKey(
                name: "FK_Ministries_Ministries_MinistryObjectId",
                table: "Ministries",
                column: "MinistryObjectId",
                principalTable: "Ministries",
                principalColumn: "Id");
        }
    }
}
