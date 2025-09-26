# Fix Google Classroom Authentication Issues

This guide will help you resolve the "Invalid Credentials" error you're experiencing with Rep's EduCompass.

## 🔍 What Was the Problem?

The error `GaxiosError: Invalid Credentials` with status 401 indicates that your Google OAuth access token has expired or is invalid. This commonly happens because:

1. **Token Expiration**: Google OAuth access tokens expire after 1 hour
2. **Missing Refresh Logic**: The app wasn't automatically refreshing expired tokens
3. **Incomplete OAuth Setup**: Missing `access_type: 'offline'` and `prompt: 'consent'` parameters

## ✅ What I Fixed

### 1. Enhanced Token Refresh Logic (`src/lib/auth.ts`)
- Added automatic token refresh when access tokens expire
- Implemented proper error handling for refresh failures
- Added TypeScript type definitions for session and JWT tokens
- Added `access_type: 'offline'` and `prompt: 'consent'` to get refresh tokens

### 2. Improved Google Classroom Client (`src/lib/google-classroom.ts`)
- Enhanced error handling with more specific error messages
- Added proper OAuth2 client configuration with client credentials
- Better session validation and error reporting

### 3. Better API Error Handling (`src/app/api/classroom/courses/route.ts`)
- Added specific handling for authentication errors (401)
- Improved error messages to guide users to re-authenticate
- Added `requiresAuth` flag for frontend handling

## 🚀 How to Test the Fix

### Step 1: Verify Your Environment Configuration

Run the test script I created:

```bash
node test-auth.js
```

This will check if your `.env.local` file is properly configured.

### Step 2: Update Your Environment File

Make sure your `.env.local` file has real values (not placeholders):

```env
# Google OAuth 2.0 credentials
GOOGLE_CLIENT_ID=your_actual_client_id_from_google_cloud_console
GOOGLE_CLIENT_SECRET=your_actual_client_secret_from_google_cloud_console

# NextAuth configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret_key

# Demo/Development Configuration
NEXT_PUBLIC_USE_MOCKS=false
```

### Step 3: Generate a Secure NextAuth Secret

If you don't have a `NEXTAUTH_SECRET`, generate one:

```bash
openssl rand -base64 32
```

### Step 4: Clear Browser Data and Re-authenticate

1. Clear your browser cookies and local storage for localhost:3000
2. Start your development server: `npm run dev`
3. Go to http://localhost:3000
4. Sign out if you're already signed in
5. Sign in again with "Continuar con Google"
6. **Important**: Grant all requested permissions (you'll see more permissions now)

### Step 5: Test the Courses API

After signing in, try accessing the courses page or make a direct API call:

```bash
curl -X GET http://localhost:3000/api/classroom/courses \
  -H "Cookie: $(curl -c - -b - -X GET http://localhost:3000 2>/dev/null | grep -E '(next-auth|__Secure)' | awk '{print $6"="$7}' | tr '\n' ';')"
```

## 🔧 If You Still Get Errors

### Error: "No active session found"
- Make sure you're signed in
- Clear browser data and sign in again

### Error: "Authentication token has expired"
- Sign out and sign in again
- This will get you a fresh refresh token

### Error: "Access blocked" from Google
- Check your OAuth consent screen configuration in Google Cloud Console
- Make sure your email is added as a test user
- Verify all required scopes are configured

### Error: "Invalid redirect URI"
- Verify your redirect URI in Google Cloud Console is exactly: `http://localhost:3000/api/auth/callback/google`
- No trailing slashes or extra characters

## 📋 Google Cloud Console Checklist

Make sure you have:

1. ✅ **Project created** with Google Classroom API enabled
2. ✅ **OAuth consent screen** configured with all required scopes:
   - `https://www.googleapis.com/auth/classroom.courses.readonly`
   - `https://www.googleapis.com/auth/classroom.rosters.readonly`
   - `https://www.googleapis.com/auth/classroom.coursework.students.readonly`
   - `https://www.googleapis.com/auth/classroom.student-submissions.students.readonly`
   - `https://www.googleapis.com/auth/classroom.profile.emails`
   - `https://www.googleapis.com/auth/classroom.profile.photos`
3. ✅ **OAuth 2.0 credentials** created with correct redirect URI
4. ✅ **Test users** added (your email address)

## 🎯 Key Improvements Made

1. **Automatic Token Refresh**: Tokens now refresh automatically when they expire
2. **Better Error Messages**: Clear guidance on what to do when authentication fails
3. **Proper OAuth Configuration**: Added offline access and consent prompt for refresh tokens
4. **Enhanced Type Safety**: Added TypeScript definitions for better development experience
5. **Comprehensive Error Handling**: Different error types are handled appropriately

## 🔒 Security Notes

- Never commit your `.env.local` file to version control
- Use different credentials for development and production
- Regularly monitor your API usage in Google Cloud Console
- Only request the minimum required scopes

Your authentication should now work reliably with automatic token refresh! 🎉
