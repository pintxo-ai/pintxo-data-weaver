import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";

export class PoolsProcessor implements DataProcessingProcessor {
    processData(message: any): Input {
        const requestUrl = `http://vespa:8080/document/v1/pintxo/pool/docid/${message.pool}?create=true`;

        const request: Input = {
            reqUrl: requestUrl,
            fields: {
                chain: { assign: message.chain },
                project: { assign: message.project },
                symbol: { assign: message.symbol },
                tvlUsd: { assign: message.tvlUsd },
                apyBase: { assign: message.apyBase },
                apyReward: { assign: message.apyReward === null ? 0 : message.apyReward }, 
                apy: { assign: message.apy },
                rewardTokens: { assign: message.rewardTokensString }, 
                pool: { assign: message.pool },
                apyPct1D: { assign: message.apyPct1D },
                apyPct7D: { assign: message.apyPct7D },
                apyPct30D: { assign: message.apyPct30D },
                stablecoin: { assign: message.stablecoin },
                ilRisk: { assign: message.ilRisk },
                exposure: { assign: message.exposure },
                underlyingTokens: { assign: message.underlyingTokensString }, 
                apyBase7d: { assign: message.apyBase7d === null ? 0 : message.apyBase7d }, 
                apyMean30d: { assign: message.apyMean30d },
                volumeUsd1d: { assign: message.volumeUsd1d === null ? 0 : message.volumeUsd1d },
                volumeUsd7d: { assign: message.volumeUsd7d === null ? 0 : message.volumeUsd7d }, 
            },
            type: "pools",
        };
        
        return request
    };
}