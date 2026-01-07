# GitHub Pages Migration Guide

This guide will help you set up the DiFR Leaderboard on GitHub Pages at https://luke-marks0-temp.github.io/difr-demo/

## Prerequisites

- GitHub account with access to the repository
- OpenRouter and Fireworks API keys

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository: https://github.com/luke-marks0-temp/difr-demo
2. Click on **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**

### 2. Add GitHub Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:
   - Name: `OPENROUTER_API_KEY`
     - Value: Your OpenRouter API key
   - Name: `FIREWORKS_API_KEY`
     - Value: Your Fireworks API key

### 3. Create Data Directory

Create an empty `data/` directory in your repository:

```bash
mkdir data
touch data/.gitkeep
git add data/.gitkeep
git commit -m "Add data directory"
git push
```

### 4. Deploy the Code

1. Download this project code (use the Download ZIP option in v0)
2. Extract and push to your repository:

```bash
# Clone your repository
git clone https://github.com/luke-marks0-temp/difr-demo.git
cd difr-demo

# Copy all files from the downloaded project
# (app/, components/, lib/, .github/, etc.)

# Commit and push
git add .
git commit -m "Initial DiFR Leaderboard setup"
git push
```

### 5. Trigger First Run

1. Go to **Actions** tab in your repository
2. Click on "Run Audit and Deploy" workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for the workflow to complete (this may take several minutes)

### 6. Access Your Site

Once deployed, your site will be available at:
**https://luke-marks0-temp.github.io/difr-demo/**

## How It Works

### Automated Updates

- The GitHub Actions workflow runs every 12 hours automatically
- It clones the `token-difr` repository and runs `audit_demonstration.py`
- Results are saved to the `data/` directory and committed to the repository
- The Next.js app is rebuilt and redeployed to GitHub Pages

### Data Flow

1. **GitHub Actions** runs the audit script every 12 hours
2. **JSON results** are saved to the `data/` directory
3. **Frontend** fetches JSON files from the GitHub repository using the GitHub API
4. **Dashboard** displays aggregated leaderboard and time series data

### Manual Triggers

You can manually trigger an audit run:
1. Go to **Actions** → **Run Audit and Deploy**
2. Click **Run workflow**

## Testing

To test that everything is working:

1. Manually trigger the workflow (see above)
2. Check that JSON files appear in the `data/` directory
3. Visit your GitHub Pages site and verify data is displayed
4. Check that the mock data is replaced with real audit results

## Troubleshooting

### No data showing on the site
- Check that the workflow completed successfully in the Actions tab
- Verify JSON files exist in the `data/` directory
- Check browser console for any fetch errors

### Workflow failing
- Verify your API keys are correctly set in repository secrets
- Check the workflow logs in the Actions tab for specific error messages

### Site not updating
- Ensure GitHub Pages is set to use GitHub Actions as the source
- Check that the deploy job completed successfully

## Customization

### Change Audit Schedule

Edit `.github/workflows/run-audit.yml` and modify the cron schedule:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Run every 6 hours
  - cron: '0 0 * * *'    # Run daily at midnight
```

### Update Repository Name

If you change the repository name, update `basePath` in `next.config.mjs`:

```typescript
basePath: '/your-new-repo-name',
