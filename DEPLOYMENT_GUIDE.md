
# Dental Care App - Deployment Guide

This guide will help you deploy your React Native + Expo dental care management app to production.

## Prerequisites

Before deploying, ensure you have:
- [Expo CLI](https://docs.expo.dev/get-started/installation/) installed
- [EAS CLI](https://docs.expo.dev/build/setup/) installed
- An Expo account
- Apple Developer Account (for iOS deployment)
- Google Play Console Account (for Android deployment)

## 1. Setup EAS (Expo Application Services)

### Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### Login to Expo
```bash
eas login
```

### Initialize EAS in your project
```bash
eas build:configure
```

## 2. Configure App for Production

### Update app.json
Ensure your `app.json` has production-ready configuration:

```json
{
  "expo": {
    "name": "Dental Care Manager",
    "slug": "dental-care-manager",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#F8FAFB"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.dentalcare",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#F8FAFB"
      },
      "package": "com.yourcompany.dentalcare",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/images/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router"
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### Environment Variables
Create production environment variables in your Supabase project:
1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy your project URL and anon key
4. Update your `app/integrations/supabase/client.ts` with production values

## 3. Build for Production

### Build for iOS
```bash
eas build --platform ios
```

### Build for Android
```bash
eas build --platform android
```

### Build for both platforms
```bash
eas build --platform all
```

## 4. App Store Deployment

### iOS App Store

1. **Prepare App Store Connect**
   - Create a new app in App Store Connect
   - Fill in app information, screenshots, and metadata
   - Set up pricing and availability

2. **Upload Build**
   - EAS will automatically upload your build to App Store Connect
   - Or manually upload using the generated `.ipa` file

3. **Submit for Review**
   - Complete all required information
   - Submit your app for Apple's review process

### Google Play Store

1. **Prepare Google Play Console**
   - Create a new app in Google Play Console
   - Complete store listing with descriptions and screenshots
   - Set up pricing and distribution

2. **Upload Build**
   - Upload the generated `.aab` file to Google Play Console
   - Or use EAS Submit: `eas submit --platform android`

3. **Release**
   - Create a release in the Google Play Console
   - Submit for review

## 5. Web Deployment

### Build for Web
```bash
npx expo export -p web
```

### Deploy to Netlify
1. Build your web app: `npx expo export -p web`
2. Upload the `dist` folder to Netlify
3. Configure redirects for client-side routing

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts to deploy

## 6. Database Setup (Production)

### Supabase Production Setup
1. Create a production Supabase project
2. Run your migrations in production
3. Set up Row Level Security (RLS) policies
4. Configure authentication settings
5. Update environment variables in your app

### Required Tables
Ensure these tables exist in production:
- `patients`
- `procedures` 
- `appointments`
- `payments`

## 7. Testing Before Release

### Pre-deployment Checklist
- [ ] Test all CRUD operations
- [ ] Verify database connections
- [ ] Test on both iOS and Android devices
- [ ] Check all translations (English/Spanish)
- [ ] Verify app icons and splash screens
- [ ] Test offline functionality
- [ ] Performance testing
- [ ] Security review

### Test Builds
Use EAS Preview builds for testing:
```bash
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

## 8. Post-Deployment

### Monitoring
- Set up error tracking (Sentry, Bugsnag)
- Monitor app performance
- Track user analytics
- Monitor database performance

### Updates
Use EAS Update for over-the-air updates:
```bash
eas update --branch production --message "Bug fixes and improvements"
```

## 9. Maintenance

### Regular Tasks
- Monitor app store reviews
- Update dependencies regularly
- Backup database regularly
- Monitor app performance metrics
- Update app store metadata as needed

### Version Updates
1. Update version in `app.json`
2. Build new version: `eas build`
3. Test thoroughly
4. Submit to app stores
5. Release to users

## Troubleshooting

### Common Issues
1. **Build Failures**: Check EAS build logs for specific errors
2. **Database Connection**: Verify Supabase URL and keys
3. **App Store Rejection**: Review Apple/Google guidelines
4. **Performance Issues**: Use React Native performance tools

### Support Resources
- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

## Security Considerations

### Production Security
- Use environment variables for sensitive data
- Enable RLS on all Supabase tables
- Implement proper authentication
- Use HTTPS for all API calls
- Regular security audits
- Keep dependencies updated

### Data Privacy
- Implement GDPR compliance if needed
- Secure patient data according to HIPAA requirements
- Regular data backups
- Secure data transmission

---

This deployment guide should help you successfully deploy your dental care management app to production. Remember to test thoroughly before releasing to users!
