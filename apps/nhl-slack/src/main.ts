import { NestFactory } from '@nestjs/core';
import { NhlSlackModule } from './nhl-slack.module';

async function bootstrap() {
  const app = await NestFactory.create(NhlSlackModule);
  await app.listen(3000);
}
bootstrap();
