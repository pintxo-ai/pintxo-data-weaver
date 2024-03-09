import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataTypeHandler } from 'src/interfaces/handlers/data-type-handler.interface';
import { PoolData } from 'src/interfaces/types/pool.interface';

/**
 * @description The PoolHandler is responsible for fetching and processing
 *              data related to pools/yield from external endpoints.
 */
@Injectable()
export class PoolHandler implements DataTypeHandler {

    /**
     * @description Fetches raw pool data from a specified endpoint.
     * @param {string} endpoint The URL of the endpoint providing pool data.
     * @returns {Promise<string>} A Promise resolving to a stringified representation
     *                            of the fetched pool data.
     */
    async fetchData(endpoint: string): Promise<string> {
        const response = await axios.get<PoolData[]>(endpoint);
        // only stringify the data part of the response
        return JSON.stringify(response.data);
    }

    /**
     * @description Processes raw pool data, removing unnecessary fields and returning a 
     *              cleaned array of pool objects.
     * @param {any} data The raw data to be processed (likely a string in this context).
     * @returns {any} An array of processed pool objects, with specified fields removed. 
     */
    processData(data: any): any {
        const parsedData = JSON.parse(data);

        const poolsArray = parsedData.data;

        const fieldsToRemove = ['predictions', 'poolMeta', 'mu', 'sigma', 'count', 'outlier', 'apyBaseInception', 'il7d' ];

        const cleanedData = poolsArray.map((entry: PoolData) => {
            fieldsToRemove.forEach(field => {
                delete entry[field];
            });
            return entry;
        });
        return cleanedData;
    }
}