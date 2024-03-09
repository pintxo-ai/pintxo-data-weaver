import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";
import { StablecoinData } from "src/interfaces/stablecoin.interface";

export class StablecoinsProcessor implements DataProcessingProcessor {
    processData(message: StablecoinData): Input {
        const requestUrl = `http://vespa:8080/document/v1/pintxo/stablecoin/docid/${message.id}?create=true`;

        // cheat for rn bc of structure issues w/ vespa schema.
        const circulating = JSON.stringify(message.circulating);
        const circulatingPrevDay = JSON.stringify(message.circulatingPrevDay);
        const circulatingPrevWeek = JSON.stringify(message.circulatingPrevWeek);
        const circulatingPrevMonth = JSON.stringify(message.circulatingPrevMonth);
        const chainCirculating = JSON.stringify(message.chainCirculating);

        const request: Input = {
            reqUrl: requestUrl,
            fields: {
                id: { assign: message.id },
                name: { assign: message.name },
                symbol: { assign: message.symbol },
                gecko_id: { assign: message.gecko_id },
                pegType: { assign: message.pegType },
                priceSource: { assign: message.priceSource },
                pegMechanism: { assign: message.pegMechanism },
                circulating: { assign: circulating },
                circulatingPrevDay: { assign: circulatingPrevDay }, 
                circulatingPrevWeek: { assign: circulatingPrevWeek }, 
                circulatingPrevMonth: { assign: circulatingPrevMonth }, 
                chainCirculating: { assign: chainCirculating },
                chains: { assign: message.chains },
                price: { assign: message.price },
            },
            type: "stablecoins",
        };

        return request
    };
}