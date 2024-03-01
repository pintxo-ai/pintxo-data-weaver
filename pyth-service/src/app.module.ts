import { Module } from '@nestjs/common';
import { PythModule } from './pyth/pyth.module'; 

/// PURPOSE - This is the root module of the Pyth NestJS microservice. It is responsible for defining dependencies and relationships between other modules.

/**
 * Decorators:
 *  @Module() - decorator to signify this a module class.
 *    Metadata:
 *     imports: [PythModule]: specifies the app depends on the PythModule for functionality.
 */
@Module({
  imports: [PythModule],
})
export class AppModule {}