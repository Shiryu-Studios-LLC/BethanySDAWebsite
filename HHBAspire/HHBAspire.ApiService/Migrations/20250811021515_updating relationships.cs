using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HHBAspire.ApiService.Migrations
{
    /// <inheritdoc />
    public partial class updatingrelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SiteInfos_ApiLinkObject_ApiId",
                table: "SiteInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_SiteInfos_BasicInfoObject_InfoId",
                table: "SiteInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_ThumbnailObject_SiteInfos_SiteInfoId",
                table: "ThumbnailObject");

            migrationBuilder.DropTable(
                name: "ApiLinkObject");

            migrationBuilder.DropTable(
                name: "BasicInfoObject");

            migrationBuilder.DropIndex(
                name: "IX_Slides_SiteInfoId",
                table: "Slides");

            migrationBuilder.DropIndex(
                name: "IX_SiteInfos_ApiId",
                table: "SiteInfos");

            migrationBuilder.DropIndex(
                name: "IX_SiteInfos_InfoId",
                table: "SiteInfos");

            migrationBuilder.DropIndex(
                name: "IX_News_SiteInfoId",
                table: "News");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ThumbnailObject",
                table: "ThumbnailObject");

            migrationBuilder.DropIndex(
                name: "IX_ThumbnailObject_SiteInfoId",
                table: "ThumbnailObject");

            migrationBuilder.DropColumn(
                name: "ApiId",
                table: "SiteInfos");

            migrationBuilder.DropColumn(
                name: "InfoId",
                table: "SiteInfos");

            migrationBuilder.RenameTable(
                name: "ThumbnailObject",
                newName: "Thumbnails");

            migrationBuilder.AddColumn<string>(
                name: "Api_GoogleMap",
                table: "SiteInfos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Api_YoutubeChannel",
                table: "SiteInfos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Info_AboutUsBethany",
                table: "SiteInfos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Info_AboutUsSDA",
                table: "SiteInfos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Info_Address",
                table: "SiteInfos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Info_Email",
                table: "SiteInfos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Info_Phone",
                table: "SiteInfos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Info_Title",
                table: "SiteInfos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Organization",
                table: "SiteInfos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinistryObjectId",
                table: "Ministries",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "SiteInfoId",
                table: "Thumbnails",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Thumbnails",
                table: "Thumbnails",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Slides_SiteInfoId_Headline",
                table: "Slides",
                columns: new[] { "SiteInfoId", "Headline" });

            migrationBuilder.CreateIndex(
                name: "IX_News_SiteInfoId_DateTime",
                table: "News",
                columns: new[] { "SiteInfoId", "DateTime" });

            migrationBuilder.CreateIndex(
                name: "IX_Ministries_MinistryObjectId",
                table: "Ministries",
                column: "MinistryObjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Thumbnails_SiteInfoId_Type",
                table: "Thumbnails",
                columns: new[] { "SiteInfoId", "Type" });

            migrationBuilder.AddForeignKey(
                name: "FK_Ministries_Ministries_MinistryObjectId",
                table: "Ministries",
                column: "MinistryObjectId",
                principalTable: "Ministries",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Thumbnails_SiteInfos_SiteInfoId",
                table: "Thumbnails",
                column: "SiteInfoId",
                principalTable: "SiteInfos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Ministries_Ministries_MinistryObjectId",
                table: "Ministries");

            migrationBuilder.DropForeignKey(
                name: "FK_Thumbnails_SiteInfos_SiteInfoId",
                table: "Thumbnails");

            migrationBuilder.DropIndex(
                name: "IX_Slides_SiteInfoId_Headline",
                table: "Slides");

            migrationBuilder.DropIndex(
                name: "IX_News_SiteInfoId_DateTime",
                table: "News");

            migrationBuilder.DropIndex(
                name: "IX_Ministries_MinistryObjectId",
                table: "Ministries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Thumbnails",
                table: "Thumbnails");

            migrationBuilder.DropIndex(
                name: "IX_Thumbnails_SiteInfoId_Type",
                table: "Thumbnails");

            migrationBuilder.DropColumn(
                name: "Api_GoogleMap",
                table: "SiteInfos");

            migrationBuilder.DropColumn(
                name: "Api_YoutubeChannel",
                table: "SiteInfos");

            migrationBuilder.DropColumn(
                name: "Info_AboutUsBethany",
                table: "SiteInfos");

            migrationBuilder.DropColumn(
                name: "Info_AboutUsSDA",
                table: "SiteInfos");

            migrationBuilder.DropColumn(
                name: "Info_Address",
                table: "SiteInfos");

            migrationBuilder.DropColumn(
                name: "Info_Email",
                table: "SiteInfos");

            migrationBuilder.DropColumn(
                name: "Info_Phone",
                table: "SiteInfos");

            migrationBuilder.DropColumn(
                name: "Info_Title",
                table: "SiteInfos");

            migrationBuilder.DropColumn(
                name: "Organization",
                table: "SiteInfos");

            migrationBuilder.DropColumn(
                name: "MinistryObjectId",
                table: "Ministries");

            migrationBuilder.RenameTable(
                name: "Thumbnails",
                newName: "ThumbnailObject");

            migrationBuilder.AddColumn<int>(
                name: "ApiId",
                table: "SiteInfos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "InfoId",
                table: "SiteInfos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "SiteInfoId",
                table: "ThumbnailObject",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ThumbnailObject",
                table: "ThumbnailObject",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "ApiLinkObject",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GoogleMap = table.Column<string>(type: "text", nullable: true),
                    YoutubeChannel = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApiLinkObject", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BasicInfoObject",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AboutUsBethany = table.Column<string>(type: "text", nullable: true),
                    AboutUsSDA = table.Column<string>(type: "text", nullable: true),
                    Address = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Organization = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BasicInfoObject", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Slides_SiteInfoId",
                table: "Slides",
                column: "SiteInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_SiteInfos_ApiId",
                table: "SiteInfos",
                column: "ApiId");

            migrationBuilder.CreateIndex(
                name: "IX_SiteInfos_InfoId",
                table: "SiteInfos",
                column: "InfoId");

            migrationBuilder.CreateIndex(
                name: "IX_News_SiteInfoId",
                table: "News",
                column: "SiteInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_ThumbnailObject_SiteInfoId",
                table: "ThumbnailObject",
                column: "SiteInfoId");

            migrationBuilder.AddForeignKey(
                name: "FK_SiteInfos_ApiLinkObject_ApiId",
                table: "SiteInfos",
                column: "ApiId",
                principalTable: "ApiLinkObject",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SiteInfos_BasicInfoObject_InfoId",
                table: "SiteInfos",
                column: "InfoId",
                principalTable: "BasicInfoObject",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ThumbnailObject_SiteInfos_SiteInfoId",
                table: "ThumbnailObject",
                column: "SiteInfoId",
                principalTable: "SiteInfos",
                principalColumn: "Id");
        }
    }
}
