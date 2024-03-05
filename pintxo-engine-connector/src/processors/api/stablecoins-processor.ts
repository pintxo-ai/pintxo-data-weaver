import { ChainCirculatingData } from "src/interfaces/stablecoin.interface";
import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";
import { StablecoinData } from "src/interfaces/stablecoin.interface";

export class StablecoinsProcessor implements DataProcessingProcessor {
    processData(message: StablecoinData): Input {
        const requestUrl = `http://vespa:8080/document/v1/pintxo/stablecoin/docid/${message.id}?create=true`;

        // const chainCirculatingAssigned = {};
        // Object.keys(message.chainCirculating).forEach(chain => {
        //     chainCirculatingAssigned[chain] = { current: message.chainCirculating[chain].current };
        // });
        // const chainCirculatingCurrent = {};
        // Object.entries(message.chainCirculating).forEach(([chainName, data]) => {
        //     chainCirculatingCurrent[chainName] = data.current;
        // });

        // Process chainCirculating to fit the schema's expectations
        const chainCirculatingProcessed: ChainCirculatingData = {};
        Object.entries(message.chainCirculating).forEach(([chainName, chainData]) => {
            chainCirculatingProcessed[chainName] = { current: chainData.current };
        });


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
                circulating: { assign: message.circulating },
                circulatingPrevDay: { assign: message.circulatingPrevDay }, 
                circulatingPrevWeek: { assign: message.circulatingPrevWeek }, 
                circulatingPrevMonth: { assign: message.circulatingPrevMonth }, 
                chainCirculating: { assign: chainCirculatingProcessed  },
                chains: { assign: message.chains },
                price: { assign: message.price },
            },
            type: "stablecoins",
        };
        console.log('Request - ', JSON.stringify(request))
        return request
    };
}