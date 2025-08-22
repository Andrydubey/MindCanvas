# Deploying MindCanvas to Vercel

This document outlines the steps required to deploy the MindCanvas application to Vercel.

## Prerequisites

- A Vercel account
- Node.js installed on your local machine
- Git installed on your local machine

## Deployment Instructions

### Option 1: Deploying from the Vercel Dashboard

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to your Vercel account and click "New Project".
3. Import your MindCanvas repository.
4. Configure your project with the following settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click "Deploy".

### Option 2: Deploying using the Vercel CLI

1. Install the Vercel CLI globally:
   ```
   npm install -g vercel
   ```

2. Log in to your Vercel account via the CLI:
   ```
   vercel login
   ```

3. Navigate to your MindCanvas project directory and run:
   ```
   npm run deploy
   ```
   
   Or you can use the Vercel CLI directly:
   ```
   vercel --prod
   ```

## Environment Variables

If your application uses environment variables, you can configure them in the Vercel dashboard under your project's settings, or include them in a `.env` file.

## Troubleshooting

If you encounter issues with client-side routing (404 errors when refreshing pages), ensure the `vercel.json` file is correctly set up with rewrites to forward all requests to index.html.

## Updating Your Deployment

To update your deployment after making changes to your code:

1. Commit and push your changes to your repository.
2. If you've set up automatic deployments, Vercel will deploy your changes automatically.
3. Otherwise, run `npm run deploy` again to manually deploy your changes.

## Domain Configuration

To configure a custom domain for your MindCanvas deployment:

1. Go to your project settings in the Vercel dashboard.
2. Navigate to the "Domains" section.
3. Add your custom domain and follow the verification steps.
