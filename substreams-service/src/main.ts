import { NestFactory } from '@nestjs/core';
import { SubstreamsModule } from './substreams/substreams.module.js';

async function bootstrap() {
  const app = await NestFactory.create(SubstreamsModule);
  await app.listen(4000);
}
bootstrap();
