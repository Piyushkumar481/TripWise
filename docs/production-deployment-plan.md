# TripWise Production Deployment Plan

## Architecture
- Frontend: React and Vite, hosted as a static web application.
- Backend: Java 21 and Spring Boot on Azure App Service.
- Database: Azure Database for PostgreSQL Flexible Server.
- Document storage: Private Azure Blob Storage container named `tripwise-documents`.
- Source control and CI/CD: GitHub and GitHub Actions.

## Production Configuration
- Activate the `prod` Spring profile.
- Supply `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` securely.
- Require TLS for PostgreSQL connections.
- Keep Flyway enabled and Hibernate schema validation enabled.
- Supply `JWT_SECRET` securely.
- Set `TRIPWISE_STORAGE_PROVIDER=azure`.
- Supply `AZURE_STORAGE_CONNECTION_STRING` securely.
- Set `AZURE_STORAGE_CONTAINER=tripwise-documents` for the Azure Blob Storage container.
- Keep uploaded documents private.
- Never commit secrets or `.env` files.

## Current Azure Resource Inventory
- Resource group: `tripwise-rg`.
- PostgreSQL server: `tripwise-postgres-2026`.
- Database: `tripwise`.
- PostgreSQL server status: Ready.
- PostgreSQL TLS enforcement: Enabled.
- Storage account: Not found during portal inspection.
- Azure App Service: Not found during portal inspection.
- Blob container: Not yet verified.

## Deployment Verification
- [ ] Create or identify the required Azure Storage account and private container.
- [ ] Create or identify the Azure App Service.
- [ ] Configure production environment variables and secrets.
- [ ] Verify database connectivity and Flyway migrations.
- [ ] Verify Azure Blob Storage connectivity.
- [ ] Verify backend health and frontend-to-backend communication.
- [ ] Test registration, login, trip operations, document upload, and download.
- [ ] Test unauthorized resource access.
- [ ] Review application logs for errors and accidental secret exposure.

## Release Policy
Do not declare TripWise production-ready until the deployed application passes its smoke tests and critical security checks.
