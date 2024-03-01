import { Module } from '@nestjs/common';
import { PintxoEngineConnectorService } from './pintxo-engine-connector.service';
import { PintxoEngineConnectorController } from './pintxo-engine-connector.controller';

@Module({
  imports: [],
  controllers: [PintxoEngineConnectorController],
  providers: [PintxoEngineConnectorService],
})
export class PintxoEngineConnectorModule {}