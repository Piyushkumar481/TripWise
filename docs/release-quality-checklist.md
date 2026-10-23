# TripWise Release Quality Checklist

## Backend
- [x] Backend verification completed successfully.
- [x] All 152 backend tests passed locally.
- [ ] Database migration and integration tests verified in GitHub Actions.
- [ ] Backend Docker image builds successfully in GitHub Actions.

## Frontend
- [x] `npm ci` completed successfully.
- [x] `npm run lint` passed.
- [x] `npm run build` completed successfully.
- [ ] Frontend lint and build pass in GitHub Actions.
- [ ] Review the Vite bundle-size warning.
- [ ] Review the two high-severity npm audit findings.

## CI/CD and Release
- [x] CI workflow includes feature branches.
- [x] CI workflow includes a frontend build job.
- [ ] GitHub Actions completes successfully for the release-quality branch.
- [ ] Confirm failed required checks block a release.
- [ ] Verify deployment configuration and required production secrets.
- [ ] Review all intended changes before merging.