import { Module } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PintxoEngineConnectorModule } from './engine-connector/pintxo-engine-connector.module';

@Module({
  imports: [
    PintxoEngineConnectorModule,
  ],
})
export class AppModule {}