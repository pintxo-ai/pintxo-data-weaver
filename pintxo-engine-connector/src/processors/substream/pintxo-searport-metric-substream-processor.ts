import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";

export class PintxoSeaportMetricSubstreamProcessor implements DataProcessingProcessor {
  processData(message: any): Input {
    const requestUrl = `http://vespa:8080/document/v1/pintxo/metric/docid/${message.id}?create=true`;

    const request: Input = {
      reqUrl: requestUrl,
      fields: {
        protocol_ref: { assign: "id:pintxo:protocol::Opensea_Seaport" },  //TO FIX
        token: { assign: message.token },
        name: { assign: message.name || "Opensea Seaport" }, //TO FIX
        metric: { assign: message.name },  //TO FIX
        interval: { assign: message.interval },
        interval_value: { assign: message.interval_value },
        value: { assign: message.value.toString() },
      },
      type: "pintxo-seaport-substreams-topic",
    };
    
    return request
  };
}
