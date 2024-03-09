import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PintxoEngineConnectorService } from './pintxo-engine-connector.service';
import { Input } from '../interfaces/input.interface';

@Controller()
export class PintxoEngineConnectorController {
  constructor(private readonly pintxoEngineService: PintxoEngineConnectorService) { }

  /// SUBSTREAMS TOPIC(S)
  ////////////////////////////////////////////////////////////
  @EventPattern('pintxo-seaport-substreams-topic')
  async handleProcessedData(@Payload() message: any) {
    //console.log('Received Kafka message:', message);
    console.log("Weaving Data from pintxo-seaport-substreams-topic...")

    if (message) {
      await this.pintxoEngineService.processData('pintxo-seaport-substreams-topic', message);
    }

    return "<***>RECEIVED MESSAGE<***>: " + message
  }

  @EventPattern('erc-20-supply-substreams-topic')
  async handleTokenData(@Payload() message: any) {
    console.log("Weaving Data from erc-20-supply-substreams-topic...")

    if (message) {
      await this.pintxoEngineService.processData('erc-20-supply-substreams-topic', message);
    }

    return "<***>RECEIVED MESSAGE<***>: " + message
  }

  
  /// PYTH SERVICE TOPIC(S)
  ////////////////////////////////////////////////////////////
  @EventPattern('pyth-price-topic') // 
  async handlePythPrices(@Payload() message: any) {
    console.log("Weaving Data from pyth-price-topic...")

    if (message) {
      await this.pintxoEngineService.processData('pyth-price-topic', message);
    }
  }


  /// API SERVICE TOPIC(S)
  ////////////////////////////////////////////////////////////
  @EventPattern('tokens-api-topic') // 
  async handleTokenListData(@Payload() message: any) {
    console.log("Weaving Data from tokens-api-topic...")

    if (message) {
      await this.pintxoEngineService.processData('tokens-api-topic', message);
    }
  }

  @EventPattern('protocols-api-topic')
  async handleProtocolData(@Payload() message: any) {
    console.log("Weaving Data from protocols-api-topic...")

    if (message) {
      await this.pintxoEngineService.processData('protocols-api-topic', message);
    }
  }
  
  @EventPattern('chains-api-topic')
  async handleChainData(@Payload() message: any) {
    console.log("Weaving Data from chains-api-topic...")

    if (message) {
      await this.pintxoEngineService.processData('chains-api-topic', message);
    }
  }

  @EventPattern('bridges-api-topic')
  async handleBridgeData(@Payload() message: any) {
    console.log("Weaving Data from bridges-api-topic...")

    if (message) {
      await this.pintxoEngineService.processData('bridges-api-topic', message);
    }
  }

  @EventPattern('stablecoins-api-topic')
  async handleStablecoinData(@Payload() message: any) {
    console.log("Weaving Data from stablecoins-api-topic...")

    if (message) {
      await this.pintxoEngineService.processData('stablecoins-api-topic', message);
    }
  }

  @EventPattern('pools-api-topic')
  async handlePoolData(@Payload() message: any) {
    console.log("Weaving Data from pools-api-topic...")

    if (message) {
      await this.pintxoEngineService.processData('pools-api-topic', message);
    }
  }
}