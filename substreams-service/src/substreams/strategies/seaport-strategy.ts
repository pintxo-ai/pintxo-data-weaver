import { MessageProcessingStrategy } from './message-processing-strategy.interface.ts:.js';
import { Input } from '../../interfaces/input.interface.js';
import { trimPrefix } from '../../util/string-utils.js';
import * as fs from 'fs/promises';
import { PintxoMetric } from 'src/interfaces/pintxo-metric.interface.js';

// EXPORT TO UTIL FILE  (CRYPTO-UTILS.TS?)
async function loadCoinMap(filePath: string): Promise<Map<string, string>> {
  const data = await fs.readFile(filePath, 'utf8');
  const coins = JSON.parse(data);
  const coin_map = new Map<string, string>();

  coins.forEach((coin: any) => {
    if (coin.platforms && coin.platforms.ethereum) {
      coin_map.set(coin.platforms.ethereum.slice(2), coin.symbol);
    }
  });

  return coin_map;
}

const coinMap = await loadCoinMap('./src/data/addresses.json');

export class SeaportStrategy implements MessageProcessingStrategy<PintxoMetric> {
  private coin_map: Map<string, string>;

  constructor() {
    this.coin_map = coinMap;
  }

  processMessage(message: any): Input<PintxoMetric>[] {
    console.log('SEA PORT - SUPPLIED ');

    // check structure
    if (!message?.metrics || !Array.isArray(message.metrics)) {
      console.error('Invalid Seaport metric format');
      return []; // develop better error handling
    }

    const metrics: Input<PintxoMetric>[] = message.metrics.map((metricItem: any) => {
      const metric: PintxoMetric = {
        id: "Opensea Seaport:" + trimPrefix(metricItem.key),
        value: metricItem.value,
      };

      // parse
      let decomp_key = metricItem.key.split(':')
      for (const item of decomp_key) {
        let k = item.split("=");
        if (k.length > 1) {
          if (k[0] == 'hour') {
            metric.interval = 'hour';
            metric.interval_value = k[1];
          } else if (k[0] == 'minute') {
            metric.interval = 'minute';
            metric.interval_value = k[1];
          } else if (k[0] == 'token') {
            if (this.coin_map.has(k[1])) {
              metric.token = this.coin_map.get(k[1])
            } else {
              metric.token = k[1];
            }
          } else {
            metric.name = trimPrefix(k[0]);
          }
        }
      }

      return {
        fields: metric,
        type: 'pintxo-metric',
      };
    });

    return metrics;
  };

}
