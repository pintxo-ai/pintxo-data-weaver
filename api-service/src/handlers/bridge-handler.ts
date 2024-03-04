import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataTypeHandler } from 'src/interfaces/data-type-handler.interface';
import { BridgeData } from 'src/interfaces/bridge.interface';

@Injectable()
export class BridgeHandler implements DataTypeHandler {
    async fetchData(endpoint: string): Promise<string> {
        const response = await axios.get<BridgeData[]>(endpoint);
        // only stringify the data part of the response
        return JSON.stringify(response.data);
    }

    processData(data: any): any {
        const parsedData = JSON.parse(data);

        const fieldsToRemove = ['icon', 'destinationChain'];

        const cleanedData = parsedData.map((entry: BridgeData) => {
            fieldsToRemove.forEach(field => {
                delete entry[field];
            });
            return entry;
        });
        return cleanedData;
    }
}