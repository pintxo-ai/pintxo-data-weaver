import { DataProcessingProcessor } from "src/interfaces/data-processing-processor.interface"
import { Input } from "src/interfaces/input.interface";

export class BridgesProcessor implements DataProcessingProcessor {
    processData(message: any): Input {
        const requestUrl = `http://vespa:8080/document/v1/pintxo/bridge/docid/${message.id}?create=true`;
        const request: Input = {
            reqUrl: requestUrl,
            fields: {
                id: { assign: message.id },
                name: { assign: message.name },
                displayName: { assign: message.displayName || '' }, 
                volumePrevDay: { assign: message.volumePrevDay },
                volumePrev2Day: { assign: message.volumePrev2Day },
                lastHourlyVolume: { assign: message.lastHourlyVolume },
                currentDayVolume: { assign: message.currentDayVolume },
                lastDailyVolume: { assign: message.lastDailyVolume },
                dayBeforeLastVolume: { assign: message.dayBeforeLastVolume },
                weeklyVolume: { assign: message.weeklyVolume },
                monthlyVolume: { assign: message.monthlyVolume },
                chains: { assign: message.chains },
            },
            type: "bridges",
        };
        return request
    };
}