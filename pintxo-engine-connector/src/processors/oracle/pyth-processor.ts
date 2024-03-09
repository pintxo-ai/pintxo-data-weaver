import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";

export class PythProcessor implements DataProcessingProcessor {
  processData(message: any): Input {
    const requestUrl = `http://vespa:8080/document/v1/pintxo/price/docid/${message.symbol}?create=true`;
    const request: Input = {
        reqUrl: requestUrl,
        fields: {
            symbol: { assign: message.symbol }, 
            price: { assign: message.price},
        },
        type: "pyth", 
    };
    return request
  };
}