import { NestFactory } from '@nestjs/core';
import { PythModule } from './pyth/pyth.module';

/// PURPOSE - This is the entry point of the Pyth NestJS microservice. 

/**
 * Functions:
 *  bootstrap(): An asynchronous function responsible for:
 *    Creating the Nest application instance using NestFactory.create().
 *    Starting the application to listen on port 4001 (await app.listen(4001))
 */
async function bootstrap() {
  const app = await NestFactory.create(PythModule);
  await app.listen(4001);
}
bootstrap();

