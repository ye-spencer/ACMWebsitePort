# ACM Website Deployment Guide

## Prerequisites

1. **Firebase Project Setup**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore Database
   - Generate a service account key for the backend

2. **Vercel Account**
   - Sign up at https://vercel.com
   - Install Vercel CLI: `npm install -g vercel`

## Environment Variables

You'll need to set up these environment variables in Vercel:

### Frontend Variables (prefixed with VITE_)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

### Backend Variables
```
FIREBASE_PROJECT_ID=your_project_id_here
FIREBASE_CLIENT_EMAIL=your_service_account_email@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
PORT=3001
```

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install dependencies and build**
   ```bash
   cd acm_website
   npm install
   npm run build
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Set environment variables in Vercel dashboard**
   - Go to your project in Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all the variables listed above

### Option 2: Deploy via GitHub Integration

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

3. **Configure environment variables**
   - In the Vercel dashboard, go to your project
   - Navigate to Settings > Environment Variables
   - Add all the required environment variables

## Project Structure

The deployment uses this structure:
- `acm_website/dist/` - Built React frontend (static files)
- `src/server.ts` - Express.js backend (Node.js serverless functions)
- `vercel.json` - Vercel configuration

## API Routes

Your backend API will be available at:
- `https://your-domain.vercel.app/api/events/*`
- `https://your-domain.vercel.app/api/users/*`
- `https://your-domain.vercel.app/api/bookings/*`
- `https://your-domain.vercel.app/api/admin/*`

## Troubleshooting

### Build Issues
- Ensure all dependencies are installed: `npm install`
- Check that Firebase is properly configured
- Verify environment variables are set correctly

### Runtime Issues
- Check Vercel function logs in the dashboard
- Verify Firebase credentials are correct
- Ensure Firestore security rules allow your operations

### Frontend Issues
- Verify all VITE_ environment variables are set
- Check browser console for Firebase configuration errors
- Ensure Firebase project has Authentication and Firestore enabled

## Post-Deployment

1. **Test all functionality**
   - User registration/login
   - Event creation and RSVP
   - Room booking
   - Admin features

2. **Configure custom domain** (optional)
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain

3. **Set up monitoring**
   - Enable Vercel Analytics
   - Set up Firebase Analytics
   - Configure error tracking
