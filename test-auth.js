#!/usr/bin/env node

/**
 * Simple authentication test script for Rep's EduCompass
 * This script helps verify that your Google OAuth credentials are properly configured
 */

const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function testAuthSetup() {
  console.log('🔍 Testing Google OAuth Configuration...\n');

  // Check environment variables
  const requiredEnvVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ];

  let missingVars = [];
  
  console.log('📋 Checking environment variables:');
  requiredEnvVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.includes('your_') || value.includes('_here')) {
      console.log(`❌ ${varName}: Missing or using placeholder value`);
      missingVars.push(varName);
    } else {
      console.log(`✅ ${varName}: Configured`);
    }
  });

  if (missingVars.length > 0) {
    console.log('\n🚨 Configuration Issues Found:');
    console.log('Please update your .env.local file with the following:');
    missingVars.forEach(varName => {
      console.log(`- ${varName}: Get this from Google Cloud Console`);
    });
    console.log('\nRefer to GOOGLE_CLASSROOM_SETUP.md for detailed instructions.');
    return;
  }

  console.log('\n✅ All environment variables are configured!\n');

  // Test OAuth2 client creation
  try {
    console.log('🔧 Testing OAuth2 client creation...');
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
    );

    // Generate auth URL to verify scopes
    const scopes = [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/classroom.courses.readonly',
      'https://www.googleapis.com/auth/classroom.rosters.readonly',
      'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
      'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
      'https://www.googleapis.com/auth/classroom.profile.emails',
      'https://www.googleapis.com/auth/classroom.profile.photos',
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });

    console.log('✅ OAuth2 client created successfully!');
    console.log('✅ Authorization URL generated successfully!');
    
    console.log('\n📝 Next Steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Go to http://localhost:3000');
    console.log('3. Click "Continuar con Google" to sign in');
    console.log('4. Grant the requested permissions');
    console.log('5. Try accessing the courses page');

    console.log('\n🔗 If you need to manually test authorization, visit:');
    console.log(authUrl);

  } catch (error) {
    console.log('❌ Error creating OAuth2 client:', error.message);
    console.log('\nPlease check your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET values.');
  }
}

// Run the test
testAuthSetup().catch(console.error);
