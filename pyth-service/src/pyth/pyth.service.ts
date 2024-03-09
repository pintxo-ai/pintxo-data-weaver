import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Connection } from '@solana/web3.js';
import {
  getPythProgramKeyForCluster,
  getPythClusterApiUrl,
  PythConnection,
  PythCluster
} from '@pythnetwork/client';

/**
 * @description The PythService is the central component responsible for managing the
 *              connection to the Pyth network, receiving price updates, and
 *              publishing those updates to a Kafka topic.
 */
@Injectable()
export class PythService implements OnModuleInit {
  private pythConnection: PythConnection;
  private priceMap: Map<string, number>;

  constructor(@Inject('KAFKA_PYTH_SERVICE') private clientKafka: ClientKafka) { }

  /**
   * @description Lifecycle hook executed during module initialization. Initializes the
   *              connection to the Pyth network.
   */
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

  /**
   * @description Establishes the connection to the Pyth network and
   *              sets up event listeners for price changes. 
   */
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

  /**
   * @description  Handles price change events from Pyth, storing the latest prices
   *               and broadcasting updates over Kafka.
   * @param {object} productAccount Pyth product account data.
   * @param {object} priceAccount Pyth price account data.
   */
  private handlePriceChange(productAccount, priceAccount) {
    const product = productAccount.accountInfo.data.product;
    const price = priceAccount.accountInfo.data;

    if (product.hasOwnProperty('generic_symbol') && price.price && price.confidence) {
      this.priceMap.set(product.base, price.price);

      //console.log(`${product.base} price: $${price.price}`);
      this.publishToKafka(product.base, price.price);
    }
  }

  /**
   * @description Publishes a price update to the Kafka 'pyth-price-topic'.
   * @param {string} symbol The symbol (e.g., BTC, SOL).
   * @param {number} price The updated price.
   */
  private publishToKafka(symbol: string, price: number) {
    this.clientKafka.emit('pyth-price-topic', { symbol, price });
  }
}