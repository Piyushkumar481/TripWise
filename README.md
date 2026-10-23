# TripWise

TripWise is a full-stack travel planning application that helps users organize trips and manage travel information in one place. It provides a dedicated workspace for trip details, itineraries, expenses, packing lists, travel documents, and notes.

The application uses React for the frontend, Java Spring Boot for the backend, and PostgreSQL for persistent data storage. It is designed for cloud deployment using Microsoft Azure.

## Live Application

Frontend: https://zealous-bay-0a8cd2500.5.azurestaticapps.net

Backend: https://tripwise-backend-2026-cjedb5dqbrgqhma9.centralindia-01.azurewebsites.net

Repository: https://github.com/Piyushkumar481/TripWise

## Table of Contents

1. Overview
2. Features
3. Technology Stack
4. Application Architecture
5. Project Structure
6. Getting Started
7. Backend Setup
8. Frontend Setup
9. Testing and Build
10. Deployment
11. Security
12. Documentation
13. Author

## Overview

Trip planning often involves keeping itineraries, budgets, documents, and personal notes in different places. TripWise brings these activities together in a single application.

Users can manage their trips and access trip-specific information through dedicated workspace pages. The React frontend communicates with the Spring Boot backend through REST APIs. The backend handles application logic, authentication, validation, database operations, and document storage integration.

The project demonstrates full-stack development, REST API integration, database management, automated testing, version control, and cloud deployment.

## Features

### User Authentication

- User registration and login.
- Authentication for protected application functionality.
- Token-based authentication using the configured authentication system.

### Trip Management

- Create and manage trips.
- View individual trip details.
- Organize travel information by trip.
- Access a dedicated workspace for each trip.

### Itinerary Management

- Organize planned activities and itinerary entries.
- Maintain travel schedules.
- Manage itinerary information within the trip workspace.
- Validate itinerary time information.

### Expense Management

- Record expenses associated with trips.
- Keep travel spending information organized.
- Access expenses from the individual trip workspace.

### Packing Lists

- Maintain a packing list for each trip.
- Organize packing items by category.
- Track items that need to be packed.

### Travel Documents

- Manage documents associated with trips.
- Support document storage operations through the configured storage integration.
- Access document functionality through the application workspace.

### Trip Notes

- Create and manage trip-related notes.
- Keep important travel information organized.
- Access notes directly from the trip workspace.

### Cloud Deployment

- Frontend deployment through Azure Static Web Apps.
- Backend hosting through Azure App Service.
- PostgreSQL database hosting through Azure.
- Azure Blob Storage integration for document operations when configured.
- GitHub Actions workflows for configured automation and deployment.

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS
- React Router
- Axios
- Tailwind CSS and supporting interface libraries used by the application

### Backend

- Java 21
- Spring Boot 3
- Spring Web
- Spring Security
- JWT-based authentication
- Spring Data JPA
- Hibernate
- Maven
- Flyway database migrations

### Database and Storage

- PostgreSQL
- Azure Database for PostgreSQL
- Azure Blob Storage integration

### Development and DevOps

- Git
- GitHub
- Docker
- GitHub Actions
- GitHub Container Registry for configured container workflows
- Microsoft Azure

### Hosting

- Azure Static Web Apps for the frontend
- Azure App Service for the backend
- Azure Database for PostgreSQL for the database
- Azure Blob Storage for configured document storage

## Application Architecture

TripWise uses a frontend and backend architecture. The frontend handles the user interface and client-side navigation, while the backend handles API requests, application logic, authentication, validation, and data access.

### Frontend

The frontend is built with React and Vite. React components and pages provide the user interface, while React Router manages navigation between application routes. The frontend sends HTTP requests to the backend using the configured API base URL.

### Backend

The backend is built with Java and Spring Boot. REST controllers receive API requests and delegate application operations to service classes. The service layer processes business logic and uses repositories to access persistent data. Spring Security manages the configured authentication and authorization behavior.

### Database

PostgreSQL stores persistent application information. Spring Data JPA and Hibernate provide database access, while Flyway manages versioned database migrations.

### Document Storage

The backend integrates with Azure Blob Storage for document operations when the service is configured. Database records and document content are handled by their appropriate storage components.

### Request Flow

1. A user interacts with the React frontend.
2. The frontend sends a request to the Spring Boot backend.
3. The backend applies configured security checks and validates the request.
4. Application services process the requested operation.
5. Repositories communicate with PostgreSQL when database access is required.
6. Document operations use the configured storage integration when applicable.
7. The backend returns a response to the frontend.

### Deployment Architecture

- Azure Static Web Apps hosts the frontend.
- Azure App Service runs the backend application.
- Azure Database for PostgreSQL provides relational database storage.
- Azure Blob Storage supports configured document operations.
- GitHub Actions automates the repository workflows configured for the project.

## Project Structure

The repository separates the frontend, backend, documentation, and automation workflows.

```text
TripWise/
|-- .github/
|   \-- workflows/                 # CI and deployment workflows
|-- backend/
|   |-- src/
|   |   |-- main/
|   |   |   |-- java/
|   |   |   |   \-- com/tripwise/backend/
|   |   |   |       |-- config/       # Application configuration
|   |   |   |       |-- controller/   # REST API controllers
|   |   |   |       |-- dto/          # Request and response objects
|   |   |   |       |-- entity/       # Database entities
|   |   |   |       |-- repository/   # Data access components
|   |   |   |       |-- service/      # Application business logic
|   |   |   |       \-- ...           # Other supporting packages
|   |   |   \-- resources/            # Application resources and migrations
|   |   \-- test/                     # Backend automated tests
|   |-- pom.xml                       # Maven project configuration
|   |-- mvnw
|   \-- mvnw.cmd                      # Maven Wrapper for Windows
|-- frontend/
|   |-- public/                       # Public assets and routing configuration
|   |-- src/
|   |   |-- components/               # Reusable interface components
|   |   |-- pages/                    # Application pages
|   |   \-- ...                       # Other frontend modules
|   |-- package.json                  # Dependencies and npm scripts
|   |-- package-lock.json
|   \-- vite.config.js                # Vite build configuration
|-- docs/
|   \-- architecture/
|       \-- architecture.md           # System architecture documentation
\-- README.md                         # Project overview and setup guide
```

### Backend Directory

The backend contains the Spring Boot application.

- `config` contains application configuration.
- `controller` contains REST API controllers.
- `dto` contains request and response data transfer objects.
- `entity` contains database entities.
- `repository` contains data access components.
- `service` contains application business logic.
- `resources` contains application resources and database migration files.
- `test` contains backend automated tests.
- `pom.xml` defines Maven dependencies and build configuration.

### Frontend Directory

The frontend contains the React application.

- `public` contains public assets and static web application configuration.
- `src/components` contains reusable interface components.
- `src/pages` contains application pages.
- `package.json` defines frontend dependencies and available npm scripts.
- `vite.config.js` configures the Vite development server and production build.

### Documentation and Workflows

The `docs` directory contains project documentation, including the system architecture document. The `.github/workflows` directory contains the automation workflows configured for validation and deployment.

The folder tree summarizes the main repository areas. Individual files and packages may change as development continues.

## Getting Started

### Prerequisites

Install the following tools:

- Git
- Java Development Kit 21
- Node.js and npm
- Docker when required by the backend integration tests
- Access to a PostgreSQL database
- A code editor such as Visual Studio Code or IntelliJ IDEA

The application also requires suitable environment configuration for authentication, database access, and any enabled document storage functionality.

### Clone the Repository

```powershell
git clone https://github.com/Piyushkumar481/TripWise.git
cd TripWise
```

## Backend Setup

Open PowerShell in the repository directory and run:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

The backend requires a reachable PostgreSQL database and the necessary application settings. Keep the terminal open while running the application. The backend uses the port configured by the Spring Boot application.

If startup fails, review the application logs and verify the database connection and required environment settings.

## Frontend Setup

Open a second PowerShell terminal from the repository root and run:

```powershell
cd frontend
npm ci
npm run dev
```

Vite displays the local development URL in the terminal. Open that URL in your browser. Ensure that the frontend API base URL points to the backend address used for local development.

## Testing and Build

### Backend Verification

Run the following command from the `backend` directory:

```powershell
.\mvnw.cmd verify
```

This runs the Maven verification lifecycle, including configured tests and other verification steps. Some integration tests may require Docker and access to the resources specified by the test configuration.

### Frontend Production Build

Run the following commands from the `frontend` directory:

```powershell
npm ci
npm run build
```

Vite compiles the frontend and generates production build output.

### Review Changes Before Committing

From the repository root, run:

```powershell
git status
git diff --check
git diff
```

Review changes before creating a commit.

## Deployment

TripWise uses Microsoft Azure for its production hosting configuration.

### Frontend Deployment

The React application is built with Vite and deployed to Azure Static Web Apps. The configured GitHub Actions workflow automates frontend deployment from its designated repository branch. The static web application routing configuration supports client-side navigation.

### Backend Deployment

The Spring Boot backend is deployed to Azure App Service using the configured container deployment workflow. The deployed application requires appropriate runtime settings for the database, authentication, CORS, and document storage integration.

### Database Deployment

Azure Database for PostgreSQL provides the managed database service. Flyway migrations manage versioned database schema changes.

### Document Storage Deployment

The backend supports Azure Blob Storage integration for document operations when configured. Required storage settings must be provided securely through the deployment environment.

### Deployment Configuration

Environment-specific URLs, application settings, and credentials should be managed through appropriate configuration rather than hard-coded into application source files. Review the relevant GitHub Actions workflows and Azure application settings when changing deployment configuration.

## Security

- Use authentication for protected application functionality.
- Enforce authorization on the backend.
- Validate incoming data on the server.
- Keep database credentials and authentication secrets outside source control.
- Restrict CORS to the required frontend origins.
- Store cloud credentials through secure environment or application settings.
- Use HTTPS for deployed application communication.
- Protect document operations against unauthorized access.
- Review dependencies and apply appropriate security updates.
- Avoid exposing sensitive information in application logs.

The actual security guarantees depend on the implementation and configuration of each environment.

## Documentation

The detailed architecture document is available at [`docs/architecture/architecture.md`](docs/architecture/architecture.md). It describes the system components, request flow, database access, document storage integration, and deployment architecture.

## Future Improvements

Possible areas for future development include more advanced itinerary planning, improved expense summaries and reporting, additional document organization features, expanded automated end-to-end testing, production monitoring, and further dependency security automation. These are potential improvements rather than claims about existing functionality.

## Author

Piyush Kumar

GitHub: https://github.com/Piyushkumar481

Project Repository: https://github.com/Piyushkumar481/TripWise
