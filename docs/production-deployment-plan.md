# TripWise Production Deployment Plan

## Architecture
- Frontend: React and Vite, hosted as a static web application.
- Backend: Java 25 (LTS) and Spring Boot on Azure App Service.
- Database: Azure Database for PostgreSQL Flexible Server.
- Document storage: Private Azure Blob Storage container named `tripwise-documents`.
- Source control and CI/CD: GitHub and GitHub Actions.

## Production Configuration
- Set `SPRING_PROFILES_ACTIVE=prod` in Azure App Service settings. The backend Docker image also defaults to the `prod` profile.
- Supply `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD` securely.
- Require TLS for PostgreSQL connections.
- Keep Flyway enabled and Hibernate schema validation enabled.
- Supply `JWT_SECRET` securely.
- Set `TRIPWISE_STORAGE_PROVIDER=azure`.
- Supply `AZURE_STORAGE_CONNECTION_STRING` securely.
- Set `AZURE_STORAGE_CONTAINER=tripwise-documents` for the Azure Blob Storage container.
- Keep uploaded documents private.
- Never commit secrets or `.env` files.

## AI Usage Controls
- The backend uses PostgreSQL-backed per-user AI call counters; no APIM service or Redis instance is required.
- Default limits are 5 provider calls per user per 60 seconds and 30 calls per user per UTC day. Configure them with `tripwise.ai.rate-limit` settings.
- Every Gemini invocation, including itinerary retries, is counted. AI output-token limits are configured under `tripwise.ai.output-tokens`.
- Spring AI automatic transient retries are disabled so a provider attempt cannot bypass usage accounting; application-level itinerary validation retries remain counted separately.
- Configure and monitor Gemini provider-side quotas and budgets separately; request counters and output-token ceilings are not a hard monetary spending cap.
- `docs/apim/ai-cost-control-policy.xml` is a retained, inactive historical template and is not part of the production path.

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
- [ ] Verify `SPRING_PROFILES_ACTIVE=prod` in the Azure App Service configuration.
- [ ] Verify database connectivity and Flyway migrations.
- [ ] Verify Azure Blob Storage connectivity.
- [ ] Verify backend health and frontend-to-backend communication.
- [ ] Test registration, login, trip operations, document upload, and download.
- [ ] Test unauthorized resource access.
- [ ] Review application logs for errors and accidental secret exposure.

## Release Policy
Do not declare TripWise production-ready until the deployed application passes its smoke tests and critical security checks.
