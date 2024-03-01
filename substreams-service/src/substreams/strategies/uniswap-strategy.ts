import { Input } from 'src/interfaces/input.interface.js';
import { MessageProcessingStrategy } from './message-processing-strategy.interface.ts:.js';

export class UniswapStrategy implements MessageProcessingStrategy<any> {
  processMessage(messageBlock: any): Input<any>[] {
    // uniswap message processing logic
    return 
  }
}
