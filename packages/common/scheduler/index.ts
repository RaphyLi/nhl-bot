import { StorageMetada } from './metadata/storage.metadata';
import { CronManager } from './cron.manager';

export * from './cron.manager';
export * from './decortators/cron.decorator';

// export function registerCrons() {
//   CronManager.registerCrons();
// }

export function getStorageMetada(): StorageMetada {
  if (!(global as any).cronStorageMetadata)
    (global as any).cronStorageMetadata = new StorageMetada();

  return (global as any).cronStorageMetadata;
}
