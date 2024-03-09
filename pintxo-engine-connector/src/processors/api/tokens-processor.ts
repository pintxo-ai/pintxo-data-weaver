import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";

export class TokensProcessor implements DataProcessingProcessor {
  processData(message: any): Input {
    const requestUrl = `http://vespa:8080/document/v1/pintxo/tokens/docid/${message.id}?create=true`;

    const request: Input = {
        reqUrl: requestUrl,
        fields: {
            id: { assign: message.id }, 
            symbol: { assign: message.symbol }, 
            name: { assign: message.name},
        },
        type: "tokens", 
    };
    
    return request
  };
}