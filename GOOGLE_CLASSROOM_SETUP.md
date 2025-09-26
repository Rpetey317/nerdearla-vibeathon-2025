# Google Classroom API Setup Guide

This guide will help you set up Google Classroom API access for the Semillero Digital dashboard.

## Prerequisites

1. A Google account with access to Google Classroom
2. Node.js and npm installed
3. The project dependencies installed (`npm install`)

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `semillero-digital-dashboard`
4. Click "Create"

## Step 2: Enable Google Classroom API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google Classroom API"
3. Click on it and press "Enable"
4. Also enable "Google Calendar API" (for future attendance features)

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Choose "External" (unless you have a Google Workspace)
3. Fill in the required fields:
   - **App name**: `Semillero Digital Dashboard`
   - **User support email**: Your email
   - **Developer contact information**: Your email
4. Click "Save and Continue"
5. On "Scopes" page, click "Add or Remove Scopes"
6. Add these scopes:
   - `https://www.googleapis.com/auth/classroom.courses.readonly`
   - `https://www.googleapis.com/auth/classroom.rosters.readonly`
   - `https://www.googleapis.com/auth/classroom.coursework.students.readonly`
   - `https://www.googleapis.com/auth/classroom.student-submissions.students.readonly`
   - `https://www.googleapis.com/auth/classroom.profile.emails`
   - `https://www.googleapis.com/auth/classroom.profile.photos`
7. Click "Update" and "Save and Continue"
8. Add test users (emails of people who will test the app)
9. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Name: `Semillero Digital Web Client`
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-production-domain.com/api/auth/callback/google` (for production)
6. Click "Create"
7. **Important**: Copy the Client ID and Client Secret

## Step 5: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` with your credentials:
   ```env
   # Google OAuth 2.0 credentials
   GOOGLE_CLIENT_ID=your_client_id_from_step_4
   GOOGLE_CLIENT_SECRET=your_client_secret_from_step_4

   # NextAuth configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_string_here
   ```

3. Generate a random secret for NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

## Step 6: Install Dependencies and Run

1. Install the new dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000
4. You should see a sign-in page
5. Click "Continuar con Google" and authorize the app

## Step 7: Grant Classroom Access

For the app to access Google Classroom data, users need to:

1. **Be signed in** to a Google account that has access to Google Classroom
2. **Have appropriate permissions** in the classrooms they want to access:
   - **Teachers**: Can see all student data for their courses
   - **Students**: Can only see their own data
   - **Coordinators/Admins**: Need to be added as co-teachers to see course data

## Troubleshooting

### "Access blocked" Error
- Make sure your OAuth consent screen is properly configured
- Add the user's email to the test users list
- Verify all required scopes are added

### "Invalid redirect URI" Error
- Check that your redirect URI in Google Cloud Console matches exactly
- For development: `http://localhost:3000/api/auth/callback/google`
- Make sure there are no trailing slashes

### "No courses found" Error
- Verify the signed-in user has access to Google Classroom
- Check that the user is enrolled in or teaching active courses
- Ensure the courses are in "ACTIVE" state (not archived)

### API Quota Exceeded
- Google Classroom API has usage limits
- For development: 10,000 requests per day
- For production: Request quota increase in Google Cloud Console

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Use different credentials** for development and production
3. **Regularly rotate** your OAuth client secret
4. **Monitor API usage** in Google Cloud Console
5. **Add only necessary scopes** - don't request more permissions than needed

## Production Deployment

When deploying to production:

1. Create new OAuth credentials with your production domain
2. Update environment variables on your hosting platform
3. Set `NEXTAUTH_URL` to your production URL
4. Update OAuth consent screen with production domain
5. Remove test users and publish the app (if needed)

## Data Privacy Notes

This app only requests **read-only** access to:
- Course information
- Student rosters
- Assignments and submissions
- User profile information

The app **cannot**:
- Modify or delete classroom data
- Create new assignments
- Change grades
- Access private messages

All data is processed locally and not stored permanently unless explicitly configured.
