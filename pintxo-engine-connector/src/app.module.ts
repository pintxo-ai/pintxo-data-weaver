import { Module } from '@nestjs/common';
import { PintxoEngineConnectorModule } from './engine-connector/pintxo-engine-connector.module';

@Module({
  imports: [
    PintxoEngineConnectorModule,
  ],
})
export class AppModule {}