// import { Injectable } from '@nestjs/common';
// import { DataProcessingStrategy } from '../interfaces/data-processing-strategy.interface';
// import { PintxoEngineConnectorService } from '../engine-connector/pintxo-engine-connector.service';

// @Injectable()
// export class PythPriceProcessingStrategy implements DataProcessingStrategy {
//     constructor(private readonly pintxoEngineService: PintxoEngineConnectorService) {}

//     async process(message: any) {
//         console.log(`Processing Pyth price data: ${message.price}`);
//         const requestUrl = `http://vespa:8080/document/v1/prices/price/docid/${message.symbol}?create=true`;
//         await this.pintxoEngineService.uploadData(requestUrl, message, 'pyth');
//     }
// }
// import { Injectable } from '@nestjs/common';
// import { DataProcessingStrategy } from '../interfaces/data-processing-strategy.interface';

// @Injectable()
// export class PythPriceProcessingStrategy extends DataProcessingStrategy {
//     async process(message: any) {
//         console.log(`Processing Pyth price data: ${message.price}`);
//         const requestUrl = `http://vespa:8080/document/v1/prices/price/docid/${message.symbol}?create=true`;
//         await this.pintxoEngineService.uploadData(requestUrl, message, 'pyth');
//     }
// }