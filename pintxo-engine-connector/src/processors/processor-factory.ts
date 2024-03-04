import { DataProcessingProcessor } from 'src/interfaces/data-processing-processor.interface.js';
import { SubstreamMetricProcessor } from './substeam-metric-processor';
import { PythProcessor } from './pyth-processor';
import { TokensProcessor } from './tokens-processor';
import { ProtocolsProcessor } from './protocols-processor';
import { ChainsProcessor } from './chains-processor';
import { BridgesProcessor } from './bridges-processor';

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
            case "pintxo-substreams-topic":
                return new SubstreamMetricProcessor();
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
            default:
                throw new Error(`Processor for Kafka Topic [${topic}] not found`);
        }
    }
}