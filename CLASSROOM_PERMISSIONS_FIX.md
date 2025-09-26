# Google Classroom Permissions Fix

## Issue
Getting 403 "The caller does not have permission" errors when accessing course work and student submissions.

## Root Cause
The OAuth scopes in the application were missing the necessary permissions to access course work as a teacher. The previous configuration only included student-level permissions.

## Solution Applied

### 1. Updated OAuth Scopes
Added the following scopes to `src/lib/auth.ts`:
- `https://www.googleapis.com/auth/classroom.coursework.me.readonly` - Access to course work for the authenticated user
- `https://www.googleapis.com/auth/classroom.student-submissions.me.readonly` - Access to student submissions for the authenticated user

### 2. Enhanced Error Handling
Updated API routes to provide specific error messages for permission issues:
- `/api/classroom/courses/[courseId]/coursework/route.ts`
- `/api/classroom/courses/[courseId]/submissions/route.ts`

### 3. Improved Google Classroom Library
Enhanced error handling in `src/lib/google-classroom.ts` to provide more descriptive error messages.

## Required Actions After Fix

### 1. Re-authenticate Users
Since we've added new OAuth scopes, existing users need to re-authenticate to grant the new permissions:

1. Users should sign out of the application
2. Sign back in to trigger the new consent flow
3. Grant the additional permissions when prompted

### 2. Verify Google Cloud Console Setup
Ensure the Google Cloud Console project has the following APIs enabled:
- Google Classroom API
- Google OAuth2 API

### 3. Check User Permissions
The user must have appropriate permissions in Google Classroom:
- **Teacher access** to view course work and student submissions
- **Student access** only allows viewing their own submissions

## Testing the Fix

1. Sign out and sign back in to get new permissions
2. Try accessing a course where you have teacher permissions
3. Check the browser console for any remaining permission errors

## Common Issues

### Still Getting 403 Errors?
1. **Check user role**: Ensure the authenticated user is a teacher in the course
2. **Verify course access**: The user must have explicit access to the course
3. **Re-authenticate**: Sign out and sign back in to refresh permissions

### Course Work Not Loading?
1. **Check course state**: Only active courses show course work
2. **Verify course has assignments**: Empty courses won't have course work to display
3. **Check date filters**: Some course work might be filtered by date

## Additional Notes

- The `.me.readonly` scopes allow access to resources where the authenticated user is a teacher
- The `.students.readonly` scopes allow access to student-specific resources
- Both sets of scopes are needed for comprehensive course management functionality

## Files Modified
- `src/lib/auth.ts` - Updated OAuth scopes
- `src/app/api/classroom/courses/[courseId]/coursework/route.ts` - Enhanced error handling
- `src/app/api/classroom/courses/[courseId]/submissions/route.ts` - Enhanced error handling
- `src/lib/google-classroom.ts` - Improved error messages
