// import { Injectable } from '@nestjs/common';
// import { PythPriceProcessingStrategy } from './pyth-price-processing-strategy';
// //import { TokenListProcessingStrategy } from './token-list-processing-strategy';
// import { DataProcessingStrategy } from '../interfaces/data-processing-processor.interface'; 
// import { SubstreamsProcessingStrategy } from '../interfaces/substreams-processing-strategy.interface';
// import { PintxoEngineConnectorService } from 'src/engine-connector/pintxo-engine-connector.service';

// @Injectable()
// export class DataProcessingStrategyFactory {
//     constructor(private pintxoEngineService: PintxoEngineConnectorService) {}
    
//     private strategies: { 
//         [key: string]: DataProcessingStrategy | SubstreamsProcessingStrategy 
//     } = {
//         'pyth-price-topic': new PythPriceProcessingStrategy(this.pintxoEngineService),
//         //'api-topic-coinlist': new TokenListProcessingStrategy(),
//     };

//     getStrategy(topic: string): DataProcessingStrategy | SubstreamsProcessingStrategy {
//         const strategy = this.strategies[topic]; 
//         if (!strategy) {
//             throw new Error(`No processing strategy found for topic: ${topic}`);
//         }
//         return strategy;
//     }
// }
