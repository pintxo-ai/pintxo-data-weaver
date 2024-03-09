import { MessageProcessingStrategy } from './message-processing-strategy.interface.ts:.js';
import { Input } from '../../interfaces/input.interface.js';
import { SupplyMetric } from 'src/interfaces/supply-metric.interface.js';

export class SupplyStrategy implements MessageProcessingStrategy<SupplyMetric> {
  processMessage(message: any): Input<SupplyMetric>[] {

    // check for supply structure
    if (!message?.items || !Array.isArray(message.items)) {
      console.error('Invalid Supply metric format');
      console.log(message)
      return []; // todo better error handling
    }

    const metrics: Input<SupplyMetric>[] = message.items.map((item: any): Input<SupplyMetric> => {
      // create supply metric
      const metric: SupplyMetric = {
        address: item.address,
        supply: item.supply,
      };

      return {
        fields: metric, 
        type: 'supply-metric', 
      } as Input<SupplyMetric>;
    });

    return metrics;
  }
}