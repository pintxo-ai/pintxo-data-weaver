import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Connection } from '@solana/web3.js';
import {
  getPythProgramKeyForCluster,
  getPythClusterApiUrl,
  PythConnection,
  PythCluster
} from '@pythnetwork/client';

///PURPOSE - Core service class to interface with the Pyth network for price updates.

//  Decorators:
//    @Injectable(): Signifies this is a service available for dependency injection.

//  Lifecycle Hook:
//    onModuleInit(): Executes at module initialization to start the Pyth connection.

//  Functions:
//    initializePythConnection(): Sets up the Pyth connection.
//    handlePriceChange(): Processes price change events from Pyth
//    publishToKafka(): Emits updates to Kafka 'Pyth' topic.

@Injectable()
export class PythService implements OnModuleInit {
  private pythConnection: PythConnection;
  private priceMap: Map<string, number>;

  constructor(@Inject('KAFKA_PYTH_SERVICE') private clientKafka: ClientKafka) { }

  async onModuleInit() {
    console.log(`
                                        
    _/_/_/    _/      _/  _/_/_/_/_/  _/    _/   
   _/    _/    _/  _/        _/      _/    _/    
  _/_/_/        _/          _/      _/_/_/_/     
 _/            _/          _/      _/    _/      
_/            _/          _/      _/    _/       
                                                                                                                                                                                      
  `);
    this.initializePythConnection();
  }

  private initializePythConnection() {
    const PYTHNET_CLUSTER_NAME: PythCluster = 'pythnet';
    const connection = new Connection(getPythClusterApiUrl(PYTHNET_CLUSTER_NAME));
    const pythPublicKey = getPythProgramKeyForCluster(PYTHNET_CLUSTER_NAME);

    this.priceMap = new Map<string, number>();
    this.pythConnection = new PythConnection(connection, pythPublicKey);

    this.pythConnection.onPriceChangeVerbose((productAccount, priceAccount) => {
      this.handlePriceChange(productAccount, priceAccount);
    });

    this.pythConnection.start();
  }

  private handlePriceChange(productAccount, priceAccount) {
    const product = productAccount.accountInfo.data.product;
    const price = priceAccount.accountInfo.data;

    if (product.hasOwnProperty('generic_symbol') && price.price && price.confidence) {
      this.priceMap.set(product.base, price.price);

      //console.log(`${product.base} price: $${price.price}`);
      this.publishToKafka(product.base, price.price);
    }
  }

  private publishToKafka(symbol: string, price: number) {
    this.clientKafka.emit('pyth-price-topic', { symbol, price });
  }
}