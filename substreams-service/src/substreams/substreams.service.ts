
import { Inject, Injectable, OnModuleInit, OnApplicationBootstrap } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { createModuleHashHex, createRegistry, createRequest } from '@substreams/core';
import { Metrics } from "../types/proto/seaport_metrics.js";
import { readPackage } from '@substreams/manifest';
import { BlockEmitter } from '@substreams/node';
import { createNodeTransport } from '@substreams/node/createNodeTransport';
import { Input } from '../interfaces/input.interface.js';
import * as fs from 'fs/promises';
import 'dotenv/config';
import { firstValueFrom } from 'rxjs';

// import { Admin } from '@nestjs/microservices/external/kafka.interface.js';
// import { Kafka } from 'kafkajs';
import { SubstreamConfig } from 'src/interfaces/substreams-config.interface.js';
import { trimPrefix } from '../util/string-utils.js'
import { StrategyFactory } from './strategy-factory.js';
import { MessageProcessingStrategy } from './strategies/message-processing-strategy.interface.ts:.js';
import { PintxoMetric } from 'src/interfaces/pintxo-metric.interface.js';

@Injectable()
export class SubstreamsService implements OnModuleInit, OnApplicationBootstrap {
  constructor(@Inject('KAFKA_SUBSTREAMS_SERVICE') private clientKafka: ClientKafka) { }

  private coin_map = new Map<string, string>();
  private emitter: BlockEmitter;
  // private admin: Admin;
  private substreamsConfig: SubstreamConfig[];
  private strategy: MessageProcessingStrategy<any>;

  // 1st phase of init - load config + data
  async onModuleInit(): Promise<void> {
    console.log(`
    ██████  █    ██  ▄▄▄▄     ██████ ▄▄▄█████▓ ██▀███  ▓█████ ▄▄▄       ███▄ ▄███▓  ██████ 
  ▒██    ▒  ██  ▓██▒▓█████▄ ▒██    ▒ ▓  ██▒ ▓▒▓██ ▒ ██▒▓█   ▀▒████▄    ▓██▒▀█▀ ██▒▒██    ▒ 
  ░ ▓██▄   ▓██  ▒██░▒██▒ ▄██░ ▓██▄   ▒ ▓██░ ▒░▓██ ░▄█ ▒▒███  ▒██  ▀█▄  ▓██    ▓██░░ ▓██▄   
    ▒   ██▒▓▓█  ░██░▒██░█▀    ▒   ██▒░ ▓██▓ ░ ▒██▀▀█▄  ▒▓█  ▄░██▄▄▄▄██ ▒██    ▒██   ▒   ██▒
  ▒██████▒▒▒▒█████▓ ░▓█  ▀█▓▒██████▒▒  ▒██▒ ░ ░██▓ ▒██▒░▒████▒▓█   ▓██▒▒██▒   ░██▒▒██████▒▒
  ▒ ▒▓▒ ▒ ░░▒▓▒ ▒ ▒ ░▒▓███▀▒▒ ▒▓▒ ▒ ░  ▒ ░░   ░ ▒▓ ░▒▓░░░ ▒░ ░▒▒   ▓▒█░░ ▒░   ░  ░▒ ▒▓▒ ▒ ░
  ░ ░▒  ░ ░░░▒░ ░ ░ ▒░▒   ░ ░ ░▒  ░ ░    ░      ░▒ ░ ▒░ ░ ░  ░ ▒   ▒▒ ░░  ░      ░░ ░▒  ░ ░
  ░  ░  ░   ░░░ ░ ░  ░    ░ ░  ░  ░    ░        ░░   ░    ░    ░   ▒   ░      ░   ░  ░  ░  
        ░     ░      ░            ░              ░        ░  ░     ░  ░       ░         ░  
                          ░                                                                
  `);
    await this.loadAddressData();
    const config = await fs.readFile('./src/config/substreams.config.json', 'utf8');
    this.substreamsConfig = JSON.parse(config).substreamsConfig;
  }


  // 2nd phase of init - Set up connections and start listening to events
  async onApplicationBootstrap(): Promise<void> {
    for (const substream of this.substreamsConfig) {
      console.log('INSTANTIATED BOOSTAP FOR - ', substream)
      await this.setupSubstreamsConnection(substream);
    }
  }

  // load coin and NFT addresses
  private async loadAddressData(): Promise<void> {
    await this.load_coin_addresses('./src/data/addresses.json');
    await this.load_nft_addresses('./src/data/nft_addresses.json');
  }


  // set up substreams connection
  private async setupSubstreamsConnection(substreamsConfig: SubstreamConfig): Promise<void> {
    const token = process.env.SUBSTREAMS_API_KEY;
    if (!token) {
      throw new Error('SUBSTREAMS_API_KEY is required');
    }

    const manifestUrl = substreamsConfig.manifestUrl;
    const outputModule = substreamsConfig.outputModule;
    const startBlockNum = -10;

    const substreamPackage = await readPackage(manifestUrl);
    if (!substreamPackage.modules) {
      throw new Error('No modules found in substream package');
    }

    const moduleHash = await createModuleHashHex(substreamPackage.modules, outputModule);
    console.log(`<***>PROCESSING<***> - MODULE [${moduleHash}] FOR ${manifestUrl}::<${outputModule}>`);

    const baseUrl = 'https://eth.substreams.pinax.network:443';
    const headers = new Headers({ 'X-User-Agent': '@substreams/node', 'X-Api-Key': token });
    const registry = createRegistry(substreamPackage);
    const transport = createNodeTransport(baseUrl, token, registry, headers);
    const request = createRequest({
      substreamPackage,
      outputModule,
      startBlockNum,
    });

    this.emitter = new BlockEmitter(transport, request, registry);

    this.strategy = StrategyFactory.getStrategy(substreamsConfig.strategy);

    this.setupEventListeners(substreamsConfig);
  }


  // set up event listeners
  private setupEventListeners(substreamConfig: SubstreamConfig): void {
    const substreamName = substreamConfig.name
    console.log(`<***>EVENT LISTENERS LIVE<***> - ${substreamName}`)
    this.emitter.on("session", (session) => console.dir(session));

    this.emitter.on('anyMessage', async (message) => {
      // stategy handles message format and parsing
      const strategy = StrategyFactory.getStrategy(substreamConfig.strategy);
      const processedMetrics = strategy.processMessage(message);

      // upload each metric
      for (const metric of processedMetrics) {
        await this.upload_metric(metric, substreamName);
      }
    });

    this.emitter.on("close", (error) => error && console.error("Stream Closed:", error));
    this.emitter.on("fatalError", (error) => console.error("Fatal Error:", error));
    this.emitter.start();
  }

  async upload_metric(substreamMetric: Input<any>, substreamName: string): Promise<void> { //FIX ANY
    // console.log("***SUBSTREAM METRIC***", substreamMetric);
    const topic = `${substreamName}-substreams-topic`;

    // extract parts
    // const idPattern = /([^:]+):volume:hour=(\d+):token=([a-f0-9]+)/;
    // const matches = substreamMetric.id.match(idPattern);

    // if (!matches) {
    //   console.error('Invalid ID format');
    //   return;
    // }
    // const [_, protocolName, hour, token] = matches;

    try {
      const result = await firstValueFrom(this.clientKafka.emit(topic, {
        key: substreamMetric.type,
        value: substreamMetric.fields,
        headers: {
          'contentType': 'application/json',
          'version': '1'
        },
      }));
      console.log('Message sent successfully', result);
      // TODO Process your logic after successful emission here
    } catch (error) {
      console.error('Error sending message', error);
      // TODO Handle emission error here
    }
  }

  private async load_coin_addresses(filePath: string) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const coins = JSON.parse(data);
      coins.forEach((coin: any) => {
        if (coin.platforms && coin.platforms.ethereum) {
          this.coin_map.set(coin.platforms.ethereum.slice(2), coin.symbol);
        }
      });
    } catch (error) {
      console.error('Error reading the coin addresses file:', error);
    }
  }

  private async load_nft_addresses(filePath: string) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      const nfts = JSON.parse(data);
      nfts.forEach((nft: any) => {
        this.coin_map.set(nft.contract_address.slice(2), nft.name);
      });
    } catch (error) {
      console.error('Error reading the NFT addresses file:', error);
    }
  }
}