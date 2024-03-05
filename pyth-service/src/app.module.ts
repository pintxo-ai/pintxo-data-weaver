import { Module } from '@nestjs/common';
import { PythModule } from './pyth/pyth.module'; 

/**
 * @description The AppModule is the root module of the NestJS application. It imports
 *              the PythModule, making its components and providers available throughout
 *              the microservice.
 */
@Module({
  imports: [PythModule],
})
export class AppModule {}