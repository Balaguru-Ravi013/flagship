import type { Tree } from '@nrwl/devkit';
import { generateFiles } from '@nrwl/devkit';
import { join } from 'path';

import type { AndroidPermissionKeys } from './permissions';
import { writeRecursive } from './write-recursive';

export interface CreateAndroidFilesOptions {
  projectRoot: string;
  rootOffset: string;
  className: string;
  constantName: string;
  fileName: string;
  name: string;
  propertyName: string;
  main: string;
  mainPath: string;
  development: boolean;
  nativeConstants: Record<string, string>;
  versionName: string;
  versionCode: number;
  bundleIdentifier: string;
  defaultEnvironment: string;
  exceptionDomains: string[];
  urlSchemes: string[];
  permissions: AndroidPermissionKeys[];
  activityAttributes?: Record<string, string>;
  applicationAttributes?: Record<string, string>;
  appIcon?: string;
  launchScreen?: string;
  googleServicesJson?: string;
  googleMapsApiKey?: string;
  buildConfig?: {
    gradleVersion?: string;
    storeFile: string;
    keyAlias: string;
  };
  passwords?: {
    storePassword: string;
    keyPassword: string;
  };
  dependencies: string[];
}

const defaults = {
  activityAttributes: {
    'android:label': '@string/app_name',
    'android:launchMode': 'singleTask',
    'android:configChanges': 'keyboard|keyboardHidden|orientation|screenSize',
    'android:screenOrientation': 'fullSensor',
    'android:windowSoftInputMode': 'adjustResize',
    'android:exported': 'true',
  },
  applicationAttributes: {
    'android:allowBackup': 'false',
    'android:label': '@string/app_name',
    'android:icon': '@mipmap/ic_launcher',
    'android:theme': '@style/AppTheme',
    'android:networkSecurityConfig': '@xml/network_security_config',
  },
};
const ANDROID_PROXY = '10.0.2.2';

export const createAndroidFiles = (tree: Tree, options: CreateAndroidFilesOptions): void => {
  const androidRoot = join(options.projectRoot, 'android');

  generateFiles(tree, join(__dirname, '../files/android'), androidRoot, {
    ...options,
    exceptionDomains: [
      ...options.exceptionDomains,
      ...(options.development ? ['localhost', ANDROID_PROXY] : []),
    ],
    activityAttributes: { ...defaults.activityAttributes, ...options.activityAttributes },
    applicationAttributes: { ...defaults.applicationAttributes, ...options.applicationAttributes },
  });

  if (options.appIcon) {
    const resourcesPath = join(androidRoot, 'app', 'src', 'main', 'res');
    writeRecursive(tree, options.appIcon, resourcesPath);
  }

  if (options.launchScreen) {
    const resourcesPath = join(androidRoot, 'app', 'src', 'main', 'res');
    writeRecursive(tree, options.launchScreen, resourcesPath);
  }

  if (options.googleServicesJson) {
    const resourcesPath = join(androidRoot, 'app');
    const googleServicesJson = tree.read(options.googleServicesJson);

    if (googleServicesJson) {
      tree.write(join(resourcesPath, 'google-services.json'), googleServicesJson);
    }
  }
};
