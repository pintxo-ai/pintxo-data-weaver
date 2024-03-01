import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";

export class SubstreamMetricProcessor implements DataProcessingProcessor {
  processData(message: any): Input {
    const requestUrl = `http://vespa:8080/document/v1/pintxo/metric/docid/${message.key}?create=true`;
    const request: Input = {
        reqUrl: requestUrl,
        fields: message.fields,
        type: "pintxo-substreams", 
    };
    return request
  };
}
