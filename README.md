# Bethany SDA Website

A .NET Aspire–based solution designed to power the **Houston Haitian Bethany** website with a service-oriented backend (API + DB + Redis) and a web front-end.

---

##  Architecture Overview

This repo follows a multi-project **.NET Aspire** architecture:

```
BethanySDAWebsite/
├── .vscode/
├── HHBW/                      ← Shared class library (models, DTOs, etc.)
├── HHBAspire.ApiService/     ← API + EF Core + PostgreSQL
├── HHBAspire.Web/            ← Web front-end (calls API, caches with Redis)
├── HHBAspire.AppHost/        ← Aspire bootstrap: containers + service glue
├── SiteInfo.json             ← Seed data for initial content
└── BethanySDAWebsite.sln     ← Solution entry point
```

- **AppHost** spins up Postgres, Redis, API, and Web.
- **ApiService** hosts data endpoints powered by EF Core & PostgreSQL.
- **Web** consumes those endpoints and leverages Redis for caching.
- **HHBW** is the shared models library used by both services.

---

##  Prerequisites

- [.NET 8+ SDK or later](https://dotnet.microsoft.com/)
- [.NET Aspire installed](https://docs.aspire.dev/)
- Docker Desktop (optional; for containerized local development)

---

##  Getting Started (Local)

### 1. Clone the repo

```bash
git clone https://github.com/Shiryu-Studios-LLC/BethanySDAWebsite.git
cd BethanySDAWebsite
```

### 2. Run the solution via AppHost

This starts Postgres, Redis, API, and Web in the correct order:

```bash
dotnet run --project HHBAspire.AppHost
```

- **Database** and **Redis cache** will be auto-provisioned.
- The API will auto-create and seed its DB using `SiteInfo.json`.
- The Web front-end uses Redis and HttpClient for data consumption.

### 3. Access the apps

| Service        | Endpoint                                  |
|----------------|-------------------------------------------|
| API (Health)   | `http://localhost:<api_port>/health`      |
| Web Front-End  | `http://localhost:<web_port>/`            |
| API Basic Info | `http://localhost:<api_port>/siteinfo/basicinfo` |

*The configured ports will be shown in console logs when you run the AppHost.*

---

##  Development Workflow

### API Development

- Navigate to `HHBAspire.ApiService/`
- Modify or add endpoints (e.g., `/siteinfo/slides`)
- Run via AppHost to test changes.

### Web Front-End

- Edit UI, call new endpoints via `BethanyApiClient`.
- Redis caching is already integrated for improved performance.

### Migrations & Models

- Entity models and shared DTOs are in `HHBW/`.
- Run migrations using a design-time factory or Aspire’s Postgres tools.

---

##  Project References

- `.NET Aspire`: Service discovery, container management, binding.
- **PostgreSQL**: Powered by EF Core in the ApiService, stored in `bethanydb`.
- **Redis Cache**: Used by Web front-end, injected under `"cache"`.
- **DbInitializer**: Seeds the DB on first run using `SiteInfo.json`.

---

##  Troubleshooting

| Problem                                         | Solution                                                                 |
|------------------------------------------------|--------------------------------------------------------------------------|
| Services not starting or failing to connect    | Ensure you're running via AppHost (`dotnet run --project ...AppHost`).  |
| Missing `postgresdb` connection string         | Use `"bethanydb"` — match resource defined in AppHost.                 |
| API returns empty data on first run            | Check that `DbInitializer` seeded `SiteInfo` from `SiteInfo.json`.     |

---

##  Contributing

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature/xyz`).
3. Make changes and commit (`git commit -m "Add feature"`).
4. Push to your branch (`git push origin feature/xyz`).
5. Open a Pull Request for review.

---

##  License

This project is licensed under the [Apache 2.0 License](LICENSE.txt).

---

> **Pro tip**: For design-time EF Core migrations without AppHost, reference a `BethanyDataContextFactory` in the `HHBW` shared project.
