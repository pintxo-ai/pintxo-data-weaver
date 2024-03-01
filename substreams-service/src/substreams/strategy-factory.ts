import { BaseStrategy } from './strategies/base-strategy.js';
import { SeaportStrategy } from './strategies/seaport-strategy.js';
import { SupplyStrategy } from './strategies/supply-strategy.js';
import { MessageProcessingStrategy } from './strategies/message-processing-strategy.interface.ts:.js';

// factory class design pattern to create metric block processor strategies
export class StrategyFactory {
  static getStrategy(strategyName: string): MessageProcessingStrategy<any> {
    switch (strategyName) {
      case 'BaseStrategy':
        return new BaseStrategy();
      case 'SeaportStrategy':
        return new SeaportStrategy();
      case 'SupplyStrategy':
        return new SupplyStrategy();
      default:
        throw new Error(`Strategy with name ${strategyName} not found`);
    }
  }
}

