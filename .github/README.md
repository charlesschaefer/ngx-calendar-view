# GitHub Actions Setup

This repository includes automated workflows for building, testing, and releasing the ngx-calendar-view library.

## Workflows

### 1. CI (Continuous Integration)
**File:** `.github/workflows/ci.yml`
**Triggers:** Push to `main`/`develop`, Pull requests
**Actions:**
- Lint code
- Build library and demo app
- Run unit tests
- Run e2e tests
- Upload coverage reports

### 2. Release
**File:** `.github/workflows/release.yml`
**Triggers:** Push to `release` branch, Manual dispatch
**Actions:**
- Build library
- Run tests
- Create GitHub release
- Upload package files

### 3. Publish to NPM
**File:** `.github/workflows/publish.yml`
**Triggers:** Release published, Manual dispatch
**Actions:**
- Build library
- Run tests
- Publish to NPM registry
- Create GitHub release

## Setup Instructions

### 1. Repository Secrets

Add the following secrets to your GitHub repository:

#### NPM Token
1. Go to [NPM](https://www.npmjs.com/) and create an account
2. Generate an access token with "Automation" type
3. Add the token as `NPM_TOKEN` secret in GitHub repository settings

#### GitHub Token
The `GITHUB_TOKEN` is automatically provided by GitHub Actions.

### 2. Package.json Scripts

Ensure your `package.json` has the following scripts:

```json
{
  "scripts": {
    "build:lib": "ng build ngx-calendar-view",
    "build": "ng build",
    "test": "ng test",
    "e2e": "ng e2e",
    "lint": "ng lint"
  }
}
```

### 3. Release Process

#### Automatic Release (Recommended)
1. Push changes to `release` branch
2. GitHub Actions will automatically:
   - Build the library
   - Run tests
   - Create a GitHub release
   - Upload package files

#### Manual Release
1. Go to Actions tab in GitHub
2. Select "Release" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

### 4. Publishing to NPM

#### Automatic Publishing
1. Create a GitHub release (either manually or via the release workflow)
2. The publish workflow will automatically:
   - Build the library
   - Run tests
   - Publish to NPM
   - Create a GitHub release with NPM link

#### Manual Publishing
1. Go to Actions tab in GitHub
2. Select "Publish to NPM" workflow
3. Click "Run workflow"
4. Select the branch and click "Run workflow"

## Workflow Files

- `.github/workflows/ci.yml` - Continuous Integration
- `.github/workflows/release.yml` - Release management
- `.github/workflows/publish.yml` - NPM publishing

## Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `release` - Release preparation branch
- `feature/*` - Feature branches

## Version Management

The workflows automatically extract the version from `projects/ngx-calendar-view/package.json` and use it for:
- GitHub release tags
- NPM package version
- Release names

Make sure to update the version in the package.json before pushing to the release branch.
