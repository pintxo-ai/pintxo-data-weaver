import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientKafka } from '@nestjs/microservices';
import * as fs from 'fs';
import { DataHandlerFactory } from '../handlers/data-handler-factory';
import { EndpointConfig } from '../interfaces/types/endpoint.interface';
import { CoinListHandler } from '../handlers/coin-list-handler';
import { ProtocolHandler } from '../handlers/protocol-handler';
import { ChainHandler } from '../handlers/chain-handler';
import { BridgeHandler } from '../handlers/bridge-handler';
import { StablecoinHandler } from '../handlers/stablecoin-handler';
import { PoolHandler } from 'src/handlers/pool-handler';

/**
 * @description The ApiService is responsible for managing the fetching, processing, and 
 *              publishing of data from various configured endpoints to Kafka topics.
 */
@Injectable()
export class ApiService implements OnModuleInit {
  private endpoints: EndpointConfig[];

  /**
   * @constructor
   * @param clientKafka Injected dependency for interacting with Kafka.
   * @param dataHandlerFactory Injected dependency for managing data handlers.
   */
  constructor(
    @Inject('KAFKA_API_SERVICE') private clientKafka: ClientKafka,
    private dataHandlerFactory: DataHandlerFactory
  ) { }

  /**
   * @description Lifecycle method called on module initialization.
   *              Performs the following:
   *              1. Loads endpoint configurations
   *              2. Initializes and registers data handlers
   *              3. Initiates cron-based data fetching and processing
   */
  async onModuleInit() {
    console.log(`

    .----------------.  .----------------.  .----------------. 
    | .--------------. || .--------------. || .--------------. |
    | |      __      | || |   ______     | || |     _____    | |
    | |     /  \     | || |  |_   __ \   | || |    |_   _|   | |
    | |    / /\ \    | || |    | |__) |  | || |      | |     | |
    | |   / ____ \   | || |    |  ___/   | || |      | |     | |
    | | _/ /    \ \_ | || |   _| |_      | || |     _| |_    | |
    | ||____|  |____|| || |  |_____|     | || |    |_____|   | |
    | |              | || |              | || |              | |
    | '--------------' || '--------------' || '--------------' |
     '----------------'  '----------------'  '----------------' 
                                                                                                                                              
  `);
    this.endpoints = await this.loadEndpointsConfig();
    this.initializeHandlers();
    /////this.handleCron(); // fetch off the bat
  }

  /**
   * @description Loads the endpoint configurations from the 'endpoints.json' file.
   * @returns {Promise<EndpointConfig[]>} A promise resolving to an array of EndpointConfig objects.
   */
  private async loadEndpointsConfig(): Promise<EndpointConfig[]> {
    return JSON.parse(fs.readFileSync('./src/config/endpoints.json', 'utf-8'));
  }

  /**
   *  @description Initializes the data handlers by registering them with the DataHandlerFactory.
   */
  private initializeHandlers() {
    this.dataHandlerFactory.registerHandler('tokens', new CoinListHandler());
    this.dataHandlerFactory.registerHandler('protocols', new ProtocolHandler());
    this.dataHandlerFactory.registerHandler('chains', new ChainHandler());
    this.dataHandlerFactory.registerHandler('bridges', new BridgeHandler());
    this.dataHandlerFactory.registerHandler('stablecoins', new StablecoinHandler());
    this.dataHandlerFactory.registerHandler('pools', new PoolHandler());
  }

  /**
   * @description Cron job executing every 10 minutes
   *              Fetches and processes data for each configured endpoint.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) - EVERY_30_MINUTES
  async handleCron() {
    for (const endpointConfig of this.endpoints) {
      //console.log('CONFIG - ', endpointConfig)
      await this.fetchDataAndPublish(endpointConfig);
    }
  }

  /**
   * @description Fetches data from a configured endpoint, processes it, and publishes 
   *              the processed data to Kafka.
   * @param {EndpointConfig} config The endpoint configuration object.
   */
  async fetchDataAndPublish(config: EndpointConfig) {
    try {
      const handler = this.dataHandlerFactory.getHandler(config.dataType);
      //console.log(`HANDLER ${handler} for CONFIG ${config}`)
      const data = await handler.fetchData(config.endpoint);
      const processedData = handler.processData(data);

      processedData.forEach(item => {
        this.publishToKafka(item, config.dataType);
      });
    } catch (error) {
      console.error(`Error processing endpoint: ${config.endpoint}`, error);
    }
  }

  /**
   * @description Publishes processed data to the appropriate Kafka topic.
   * @param {any} data The processed data to be published.
   * @param {string} type The type of data, determining the Kafka topic name.
   */
  private publishToKafka(data: any, type: any) {
    const topic = `${type}-api-topic`;
    //console.log(`Publishing to topic - ${topic}`);
    this.clientKafka.emit(topic, data);
  }

}

