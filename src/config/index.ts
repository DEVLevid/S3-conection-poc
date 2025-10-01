import appConfig from './app.config';
import storageConfig from './storage.config';

export const configurations = [appConfig, storageConfig];

export { default as appConfig } from './app.config';
export { default as storageConfig } from './storage.config';
export type { AppConfig } from './app.config';
export type { StorageConfig } from './storage.config';
