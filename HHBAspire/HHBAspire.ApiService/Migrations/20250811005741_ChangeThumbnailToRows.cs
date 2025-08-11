using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HHBAspire.ApiService.Migrations
{
    /// <inheritdoc />
    public partial class ChangeThumbnailToRows : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SiteInfos_ThumbnailObject_ThumbnailId",
                table: "SiteInfos");

            migrationBuilder.DropIndex(
                name: "IX_SiteInfos_ThumbnailId",
                table: "SiteInfos");

            migrationBuilder.DropColumn(
                name: "PlaceHolderImage",
                table: "ThumbnailObject");

            migrationBuilder.DropColumn(
                name: "ThumbnailId",
                table: "SiteInfos");

            migrationBuilder.RenameColumn(
                name: "SDALogo",
                table: "ThumbnailObject",
                newName: "Url");

            migrationBuilder.AddColumn<int>(
                name: "SiteInfoId",
                table: "ThumbnailObject",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "ThumbnailObject",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ThumbnailObject_SiteInfoId",
                table: "ThumbnailObject",
                column: "SiteInfoId");

            migrationBuilder.AddForeignKey(
                name: "FK_ThumbnailObject_SiteInfos_SiteInfoId",
                table: "ThumbnailObject",
                column: "SiteInfoId",
                principalTable: "SiteInfos",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThumbnailObject_SiteInfos_SiteInfoId",
                table: "ThumbnailObject");

            migrationBuilder.DropIndex(
                name: "IX_ThumbnailObject_SiteInfoId",
                table: "ThumbnailObject");

            migrationBuilder.DropColumn(
                name: "SiteInfoId",
                table: "ThumbnailObject");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "ThumbnailObject");

            migrationBuilder.RenameColumn(
                name: "Url",
                table: "ThumbnailObject",
                newName: "SDALogo");

            migrationBuilder.AddColumn<string>(
                name: "PlaceHolderImage",
                table: "ThumbnailObject",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ThumbnailId",
                table: "SiteInfos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SiteInfos_ThumbnailId",
                table: "SiteInfos",
                column: "ThumbnailId");

            migrationBuilder.AddForeignKey(
                name: "FK_SiteInfos_ThumbnailObject_ThumbnailId",
                table: "SiteInfos",
                column: "ThumbnailId",
                principalTable: "ThumbnailObject",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
