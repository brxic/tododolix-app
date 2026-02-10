import type {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.basil.tododolix',
  appName: 'Tododolix',
  webDir: 'dist/tododolix-mobile/browser',
  bundledWebRuntime: false,
  android: {
    path: 'android'
  }
};

export default config;
