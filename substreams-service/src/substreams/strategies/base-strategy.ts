import { MessageProcessingStrategy } from './message-processing-strategy.interface.ts:.js';
import { Input } from '../../interfaces/input.interface.js';
import { trimPrefix } from '../../util/string-utils.js';

export class BaseStrategy implements MessageProcessingStrategy<any> {
  processMessage(messageBlock: any): Input<any>[] {
    console.log('BASED')
    return messageBlock
  };
}