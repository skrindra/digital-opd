import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'digital-opd',
  slug: 'digital-opd',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    edgeToEdgeEnabled: true
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-sqlite',
      {
        enableFTS: true,
        useSQLCipher: true,
        android: {
          enableFTS: false,
          useSQLCipher: false
        },
        ios: {
          customBuildFlags: ['-DSQLITE_ENABLE_DBSTAT_VTAB=1 -DSQLITE_ENABLE_SNAPSHOT=1']
        }
      }
    ]
  ],
  extra: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY
  }
}); 