import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataTypeHandler } from 'src/interfaces/handlers/data-type-handler.interface';
import { BridgeData } from 'src/interfaces/types/bridge.interface';

/**
 * @description The BridgeHandler is responsible for fetching and processing
 *              data related to bridges from external endpoints.
 */
@Injectable()
export class BridgeHandler implements DataTypeHandler {

    /**
     * @description Fetches raw bridge data from a specified endpoint.
     * @param {string} endpoint The URL of the endpoint providing bridge data.
     * @returns {Promise<string>} A Promise resolving to a stringified representation
     *                            of the fetched bridge data.
     */
    async fetchData(endpoint: string): Promise<string> {
        const response = await axios.get<BridgeData[]>(endpoint);
        // only stringify the data part of the response
        return JSON.stringify(response.data);
    }

    /**
     * @description Processes raw bridge data, removing unnecessary fields and returning a 
     *              cleaned array of bridge objects.
     * @param {any} data The raw data to be processed (likely a string in this context).
     * @returns {any} An array of processed bridge objects, with specified fields removed. 
     */
    processData(data: any): any {
        const parsedData = JSON.parse(data);

        const bridgesArray = parsedData.bridges;

        const fieldsToRemove = ['icon', 'destinationChain'];

        const cleanedData = bridgesArray.map((entry: BridgeData) => {
            fieldsToRemove.forEach(field => {
                delete entry[field];
            });
            return entry;
        });
        return cleanedData;
    }
}