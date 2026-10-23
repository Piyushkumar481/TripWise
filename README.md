# TripWise - Smart Travel Planning Platform

TripWise is a full-stack travel application for managing trips, itineraries, expenses, documents, packing lists, and notes.

## Live Links
- Website: https://zealous-bay-0a8cd2500.5.azurestaticapps.net
- GitHub: https://github.com/Piyushkumar481/TripWise
- GitHub Actions: https://github.com/Piyushkumar481/TripWise/actions

## Features
- User registration and JWT authentication
- Trip creation and management
- Itinerary planning and expense tracking
- Document upload and download
- Packing lists and travel notes
- PostgreSQL persistence and Flyway migrations
- Azure Blob Storage integration
- Responsive React interface

## Technology Stack
- Frontend: React, Vite, Tailwind CSS, React Router, Axios
- Backend: Java 21, Spring Boot, Spring Security, Spring Data JPA, JWT
- Database: PostgreSQL and Azure Database for PostgreSQL
- Storage: Azure Blob Storage
- DevOps: Docker, GitHub Actions, GitHub Container Registry
- Hosting: Azure Static Web Apps and Azure App Service

## Architecture
See [Architecture Documentation](docs/architecture/architecture.md).

## Local Development
Backend: configure the required environment variables, enter the backend directory, then run .\mvnw.cmd spring-boot:run.
Frontend: enter the frontend directory, run npm ci, then npm run dev.
Build the frontend using npm run build.

## Verification
Recorded October 23, 2026: backend verification passed with 152 tests, zero failures, and zero errors. The frontend production build succeeded. End-to-end tests were reported as passing by the developer.

## Security
Never commit passwords, tokens, connection strings, or private documents. Use protected settings for credentials and enforce authentication and resource ownership.

## Author
Piyush Kumar
