import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PintxoEngineConnectorService } from './pintxo-engine-connector.service';
import { Input } from '../interfaces/input.interface';

@Controller()
export class PintxoEngineConnectorController {
  constructor(private readonly pintxoEngineService: PintxoEngineConnectorService) { }

  /// SUBSTREAMS TOPICS 
  ////////////////////////////////////////////////////////////
  @EventPattern('pintxo-substreams-topic')
  async handleProcessedData(@Payload() message: any) {
    //console.log('Received Kafka message:', message);
    console.log("Weaving Data from pintxo-substreams-topic...")

    if (message) {
      await this.pintxoEngineService.processData('pintxo-substreams-topic', message);
    }

    return "<***>RECEIVED MESSAGE<***>: " + message
  }

  @EventPattern('ERC-20-Supply-substreams-topic')
  async handleTokenData(@Payload() message: any) {
    //console.log('Received Kafka token:', message);
    console.log("Weaving Data from ERC-20-Supply-substreams-topic...")

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
    console.log("Weaving Data from pyth-price-topic...")

    if (message) {
      await this.pintxoEngineService.processData('pyth-price-topic', message);
    }
  }


  /// API SERVICE TOPICS
  ////////////////////////////////////////////////////////////
  @EventPattern('tokens-api-topic') // 
  async handleTokenListData(@Payload() message: any) {
    //console.log('Received Kafka message from tokens-api-topic:', message);
    console.log("Weaving Data from tokens-api-topic...")

    if (message) {
      await this.pintxoEngineService.processData('tokens-api-topic', message);
    }
  }

  @EventPattern('protocols-api-topic')
  async handleProtocolData(@Payload() message: any) {
    //console.log('Received Kafka message from protocols-api-topic:', message);
    console.log("Weaving Data from protocols-api-topic...")

    if (message) {
      await this.pintxoEngineService.processData('protocols-api-topic', message);
    }
  }
  
  @EventPattern('chains-api-topic')
  async handleChainData(@Payload() message: any) {
    //console.log('Received Kafka message from chains-api-topic:', message);
    console.log("Weaving Data from chains-api-topic...")

    if (message) {
      await this.pintxoEngineService.processData('chains-api-topic', message);
    }
  }

  @EventPattern('bridges-api-topic')
  async handleBridgeData(@Payload() message: any) {
    //console.log('Received Kafka message from bridges-api-topic:', message);
    console.log("Weaving Data from bridges-api-topic...")

    if (message) {
      await this.pintxoEngineService.processData('bridges-api-topic', message);
    }
  }
}