import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";

export class ProtocolsProcessor implements DataProcessingProcessor {
    processData(message: any): Input {
        const requestUrl = `http://vespa:8080/document/v1/pintxo/protocol/docid/${message.name}?create=true`;
        const request: Input = {
            reqUrl: requestUrl,
            fields: {
                id: { assign: message.id },
                symbol: { assign: message.symbol },
                name: { assign: message.name },
                address: { assign: message.address },
                url: { assign: message.url },
                description: { assign: message.description },
                chain: { assign: message.chain },
                gecko_id: { assign: message.gecko_id },
                cmcId: { assign: message.cmcId || '' }, // needs to be string? handle null vs empty string better
                category: { assign: message.category },
                chains: { assign: message.chains },
                twitter: { assign: message.twitter },
                tvl: { assign: message.tvl },
                chainTvls: { assign: message.chainTvls },
                change_1h: { assign: message.change_1h },
                change_1d: { assign: message.change_1d },
                change_7d: { assign: message.change_7d },
                mcap: { assign: message.mcap },
            },
            type: "protocols",
        };

        return request
    };
}