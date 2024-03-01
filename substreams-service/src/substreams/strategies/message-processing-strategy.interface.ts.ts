import { Input } from '../../interfaces/input.interface.js';

export interface MessageProcessingStrategy<T> {
  processMessage(message: any): Input<T>[];
}