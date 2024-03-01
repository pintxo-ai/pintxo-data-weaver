import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { ClientKafka } from '@nestjs/microservices';
import axios from 'axios';
import * as fs from 'fs';
import { DataHandlerFactory } from './data-handler-factory';
import { EndpointConfig } from './interfaces/endpoint.interface';
import { CoinListHandler } from './handlers/coin-list-handler';
import { ProtocolHandler } from './handlers/protocol-handler';

@Injectable()
export class ApiService implements OnModuleInit {
  private endpoints: EndpointConfig[];

  constructor(
    @Inject('KAFKA_API_SERVICE') private clientKafka: ClientKafka,
    private dataHandlerFactory: DataHandlerFactory
    //private schedulerRegistry: SchedulerRegistry
  ) { }

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
    // this.endpointsConfig = JSON.parse(fs.readFileSync('endpoints.json', 'utf8'));
    // this.endpointsConfig.forEach((config) => {
    //   this.scheduleJob(config);
    // });
    this.endpoints = await this.loadEndpointsConfig();
    this.initializeHandlers();
    this.handleCron();
  }

  private async loadEndpointsConfig(): Promise<EndpointConfig[]> {
    return JSON.parse(fs.readFileSync('./src/endpoints/endpoints.json', 'utf-8'));
  }

  private initializeHandlers() {
    // register handlers to factory
    this.dataHandlerFactory.registerHandler('tokens', new CoinListHandler());
    this.dataHandlerFactory.registerHandler('protocols', new ProtocolHandler());
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) EVERY_30_SECONDS
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    for (const endpointConfig of this.endpoints) {
      console.log('CONFIG - ', endpointConfig)
      await this.fetchDataAndPublish(endpointConfig);
    }
  }

  async fetchDataAndPublish(config: EndpointConfig) {
    try {
      const handler = this.dataHandlerFactory.getHandler(config.dataType);
      //console.log(`HANDLER ${handler} for CONFIG ${config}`)
      const data = await handler.fetchData(config.endpoint);
      const processedData = handler.processData(data);
      //this.publishToKafka(processedData, config.dataType);
      processedData.forEach(item => {
        this.publishToKafka(item, config.dataType);
      });
    } catch (error) {
      console.error(`Error processing endpoint: ${config.endpoint}`, error);
    }
  }

  // publish data to corresponding kafka api 'type' topic
  private publishToKafka(data: any, type: any) {
    console.log('tip - ', type)
    this.clientKafka.emit(`${type}-api-topic`, data);
  }

  // scheduleJob(config: any) {
  //   const job = new CronJob(CronExpression.EVERY_DAY_AT_MIDNIGHT, async () => {
  //     const data = await this.fetchDataFromEndpoint(config.endpoint);
  //     const handler = DataHandlerFactory.getHandler(config.dataType);
  //     const processedData = handler.handleData(data);
  //     this.publishToKafka(processedData);
  //   });

  //   this.schedulerRegistry.addCronJob(`${config.endpoint}-job`, job);
  //   job.start();
  // }
}

