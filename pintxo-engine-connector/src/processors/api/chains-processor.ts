import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";

export class ChainsProcessor implements DataProcessingProcessor {
    processData(message: any): Input {
        const requestUrl = `http://vespa:8080/document/v1/pintxo/chain/docid/${message.name}?create=true`;
        const request: Input = {
            reqUrl: requestUrl,
            fields: {
                gecko_id: { assign: message.gecko_id },
                tvl: { assign: message.tvl },
                tokenSymbol: { assign: message.tokenSymbol },
                cmcId: { assign: message.cmcId || '' },
                name: { assign: message.name },
                chainId: { assign: message.chainId },
            },
            type: "chains",
        };
        return request
    };
}