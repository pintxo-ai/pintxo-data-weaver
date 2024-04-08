import { Module } from '@nestjs/common';
import { SubstreamsModule } from './substreams/substreams.module.js';

/**
 * @description The AppModule is the root module of the NestJS application. It imports
 *              the SubstreamsModule, making its components and providers available throughout
 *              the microservice.
 */
@Module({
  imports: [SubstreamsModule],
})
export class AppModule {}