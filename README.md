# TripWise

Smart Travel Planning Platform

## Tech Stack

- Spring Boot
- React
- PostgreSQL
- Docker
- Azure

## Environment Variables

| Variable | Purpose |
|---|---|
| `DB_URL` | PostgreSQL connection URL |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRATION` | JWT validity duration |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |

## Local Development

Create a `.env` file in the project root and provide the required environment variables.

Use `.env.example` as the template.

Start the development environment with:

    docker compose -f docker-compose.dev.yml up --build

Backend health:

    http://localhost:8080/api/health

Actuator health:

    http://localhost:8080/actuator/health

Swagger:

    http://localhost:8080/swagger-ui/index.html

TripWise CI/CD pipeline
