require('module-alias/register');

import { DatabaseService } from '@nhl/common';
import { SlackApp } from './app';
// import { CommandService, NotificationService } from './services';
import { Jobs } from './services/jobs.service';

async function bootstrap() {
  // await NHLApplication.create();
  // registerCrons();

  // var db = container.get(DatabaseService);
  // db.connect();
  // const app = new SlackApp(
  //   container.get(DatabaseService),
  //   // container.get(CommandService),
  //   // container.get(NotificationService),
  //   // container.get(SyncService),
  //   // container.get(ScheduleService)
  //   container.get(Jobs)
  // );
  // await app.start();

  console.log('⚡️ Bolt app is running!');
}
bootstrap();

// const syncService = container.resolve(SyncService);
// const notificationService = container.resolve(NotificationService);

// syncService.checkSync();
// notificationService.init();

console.log('test');
