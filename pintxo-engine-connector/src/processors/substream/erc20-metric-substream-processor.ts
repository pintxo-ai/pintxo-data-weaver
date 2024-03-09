import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";

export class ERC20MetricSubstreamProcessor implements DataProcessingProcessor {
  processData(message: any): Input {
    const requestUrl = `http://vespa:8080/document/v1/pintxo/erc20_supply/docid/${message.address}?create=true`;
    
    const request: Input = {
      reqUrl: requestUrl,
      fields: {
        address: { assign: message.address }, 
        supply: { assign: message.supply },
      },
      type: "erc-20-supply-substreams-topic",
    };
    //NEED TO AUGMENT PINAX ERC 20 SUBSTREAM TO OUTPUT SOME TRACKING DATA
    // ie. timestamp or interval or block or something
    return request
  };
}