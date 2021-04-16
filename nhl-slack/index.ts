import { DatabaseService, ScheduleService } from '@nhl/common';
import { container, createPlatform } from '@nhl/core';
import { SlackApp } from './app';
import { CommandService, SyncService, NotificationService } from './services';

createPlatform()
  .bootstrap()
  .then(() => {
    (async () => {
      const app = new SlackApp(
        container.resolve(DatabaseService),
        container.resolve(CommandService),
        container.resolve(NotificationService),
        container.resolve(SyncService),
        container.resolve(ScheduleService)
      );
      await app.start();

      console.log('⚡️ Bolt app is running!');
    })();
  });

const syncService = container.resolve(SyncService);
const notificationService = container.resolve(NotificationService);

syncService.checkSync();
notificationService.init();
