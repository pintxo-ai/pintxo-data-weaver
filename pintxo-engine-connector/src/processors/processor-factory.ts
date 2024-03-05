import { DataProcessingProcessor } from 'src/interfaces/data-processing-processor.interface.js';
import { PintxoSeaportMetricSubstreamProcessor } from './substream/pintxo-searport-metric-substream-processor';
import { PythProcessor } from './oracle/pyth-processor';
import { TokensProcessor } from './api/tokens-processor';
import { ProtocolsProcessor } from './api/protocols-processor';
import { ChainsProcessor } from './api/chains-processor';
import { BridgesProcessor } from './api/bridges-processor';
import { StablecoinsProcessor } from './api/stablecoins-processor';
import { ERC20MetricSubstreamProcessor } from './substream/erc20-metric-substream-processor';

/**
 * The ProcessorFactory is a factory-pattern class responsible for 
 * creating the appropriate DataProcessingProcessor implementation based
 * on a provided Kafka topic.
 */
export class ProcessorFactory {

    /**
     * Returns the appropriate DataProcessingProcessor based on the provided topic.
     * 
     * @param {string} topic - The Kafka topic name.
     * @returns {DataProcessingProcessor} - An instance of a DataProcessingProcessor subclass.
     * @throws {Error} - If a processor for the specified topic is not found.
     */
    static getProcessor(topic: string): DataProcessingProcessor {
        switch (topic) {
            case "pintxo-seaport-substreams-topic":
                return new PintxoSeaportMetricSubstreamProcessor();
            case "erc-20-supply-substreams-topic":
                return new ERC20MetricSubstreamProcessor();
            case "pyth-price-topic":
                return new PythProcessor();
            case "tokens-api-topic":
                return new TokensProcessor();
            case "protocols-api-topic":
                return new ProtocolsProcessor();
            case "chains-api-topic":
                return new ChainsProcessor();
            case "bridges-api-topic":
                return new BridgesProcessor();
            case "stablecoins-api-topic":
                return new StablecoinsProcessor();
            default:
                throw new Error(`Processor for Kafka Topic [${topic}] not found`);
        }
    }
}