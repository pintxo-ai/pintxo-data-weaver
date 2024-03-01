import { Controller } from '@nestjs/common';
//import { EventPattern, Payload } from '@nestjs/microservices';
import { PintxoEngineConnectorService } from './pintxo-engine-connector.service';
import { Input } from '../interfaces/input.interface';

import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PintxoEngineConnectorController {
  constructor(private readonly pintxoEngineService: PintxoEngineConnectorService) { }

  /// SUBSTREAMS TOPICS 
  ////////////////////////////////////////////////////////////
  @EventPattern('pintxo-substreams-topic')
  async handleProcessedData(@Payload() message: any) {
    console.log('Received Kafka message:', message);

    //console.log(`Message Key: ${message.key}`);

    if (message) {
      await this.pintxoEngineService.processData('pintxo-substreams-topic', message);
    }

    return "<***>RECEIVED MESSAGE<***>: " + message
  }

  @EventPattern('ERC-20-Supply-substreams-topic')
  async handleTokenData(@Payload() message: any) {
    console.log('Received Kafka token:', message);

    //console.log(`Message Key: ${message.key}`);

    // if (message) {
    //   await this.pintxoEngineService.processData(message);
    // }

    return "<***>RECEIVED MESSAGE<***>: " + message
  }

  
  /// PYTH SERVICE TOPICS
  ////////////////////////////////////////////////////////////
  @EventPattern('pyth-price-topic') // 
  async handlePythPrices(@Payload() message: any) {
    //console.log('Received Kafka message from pyth-price-topic:', message);

    if (message) {
      await this.pintxoEngineService.processData('pyth-price-topic', message);
    }
  }


  /// API SERVICE TOPICS
  ////////////////////////////////////////////////////////////
  @EventPattern('tokens-api-topic') // 
  async handleTokenListData(@Payload() message: any) {
    console.log('Received Kafka message from tokens-api-topic:', message);

    if (message) {
      await this.pintxoEngineService.processData('tokens-api-topic', message);
    }
  }
  @EventPattern('protocols-api-topic') // 
  async handleProtocolData(@Payload() message: any) {
    console.log('Received Kafka message from protocols-api-topic:', message);

    if (message) {
      await this.pintxoEngineService.processData('protocols-api-topic', message);
    }
  }
  

}