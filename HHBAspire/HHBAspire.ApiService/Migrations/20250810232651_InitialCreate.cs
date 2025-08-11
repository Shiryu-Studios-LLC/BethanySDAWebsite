using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HHBAspire.ApiService.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ApiLinkObject",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    YoutubeChannel = table.Column<string>(type: "text", nullable: true),
                    GoogleMap = table.Column<string>(type: "text", nullable: true)
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
                    Title = table.Column<string>(type: "text", nullable: true),
                    Organization = table.Column<string>(type: "text", nullable: true),
                    Phone = table.Column<string>(type: "text", nullable: true),
                    Email = table.Column<string>(type: "text", nullable: true),
                    Address = table.Column<string>(type: "text", nullable: true),
                    AboutUsSDA = table.Column<string>(type: "text", nullable: true),
                    AboutUsBethany = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BasicInfoObject", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ThumbnailObject",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PlaceHolderImage = table.Column<string>(type: "text", nullable: true),
                    SDALogo = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThumbnailObject", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteInfos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Language = table.Column<int>(type: "integer", nullable: false),
                    InfoId = table.Column<int>(type: "integer", nullable: false),
                    ThumbnailId = table.Column<int>(type: "integer", nullable: false),
                    ApiId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteInfos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SiteInfos_ApiLinkObject_ApiId",
                        column: x => x.ApiId,
                        principalTable: "ApiLinkObject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SiteInfos_BasicInfoObject_InfoId",
                        column: x => x.InfoId,
                        principalTable: "BasicInfoObject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SiteInfos_ThumbnailObject_ThumbnailId",
                        column: x => x.ThumbnailId,
                        principalTable: "ThumbnailObject",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Ministries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SiteInfoId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: true),
                    Image = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ministries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Ministries_SiteInfos_SiteInfoId",
                        column: x => x.SiteInfoId,
                        principalTable: "SiteInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "News",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SiteInfoId = table.Column<int>(type: "integer", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: true),
                    Headline = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    DateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DateTimeOffset = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_News", x => x.Id);
                    table.ForeignKey(
                        name: "FK_News_SiteInfos_SiteInfoId",
                        column: x => x.SiteInfoId,
                        principalTable: "SiteInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SiteInfoId = table.Column<int>(type: "integer", nullable: false),
                    ServiceId = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Icon = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Link = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Services_SiteInfos_SiteInfoId",
                        column: x => x.SiteInfoId,
                        principalTable: "SiteInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Slides",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SiteInfoId = table.Column<int>(type: "integer", nullable: false),
                    Headline = table.Column<string>(type: "text", nullable: true),
                    BackgroundImage = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Expand = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Slides", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Slides_SiteInfos_SiteInfoId",
                        column: x => x.SiteInfoId,
                        principalTable: "SiteInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SiteInfoId = table.Column<int>(type: "integer", nullable: false),
                    Image = table.Column<string>(type: "text", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Role = table.Column<string>(type: "text", nullable: true),
                    X = table.Column<string>(type: "text", nullable: true),
                    Facebook = table.Column<string>(type: "text", nullable: true),
                    Instagram = table.Column<string>(type: "text", nullable: true),
                    Linkedin = table.Column<string>(type: "text", nullable: true),
                    Youtube = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeamMembers_SiteInfos_SiteInfoId",
                        column: x => x.SiteInfoId,
                        principalTable: "SiteInfos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Ministries_SiteInfoId",
                table: "Ministries",
                column: "SiteInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_News_SiteInfoId",
                table: "News",
                column: "SiteInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_Services_SiteInfoId",
                table: "Services",
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
                name: "IX_SiteInfos_ThumbnailId",
                table: "SiteInfos",
                column: "ThumbnailId");

            migrationBuilder.CreateIndex(
                name: "IX_Slides_SiteInfoId",
                table: "Slides",
                column: "SiteInfoId");

            migrationBuilder.CreateIndex(
                name: "IX_TeamMembers_SiteInfoId",
                table: "TeamMembers",
                column: "SiteInfoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Ministries");

            migrationBuilder.DropTable(
                name: "News");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Slides");

            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DropTable(
                name: "SiteInfos");

            migrationBuilder.DropTable(
                name: "ApiLinkObject");

            migrationBuilder.DropTable(
                name: "BasicInfoObject");

            migrationBuilder.DropTable(
                name: "ThumbnailObject");
        }
    }
}
