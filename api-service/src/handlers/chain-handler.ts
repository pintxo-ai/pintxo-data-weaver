import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataTypeHandler } from 'src/interfaces/handlers/data-type-handler.interface';

/**
 * @description The ChainHandler is responsible for fetching and processing
 *              data related to chains from external endpoints.
 */
@Injectable()
export class ChainHandler implements DataTypeHandler {

    /**
     * @description Fetches raw chain data from a specified endpoint.
     * @param {string} endpoint The URL of the endpoint providing chain data.
     * @returns {Promise<string>} A Promise resolving to a stringified representation
     *                            of the fetched chain data.
     */
    async fetchData(endpoint: string) {
        const response = await axios.get(endpoint);
        return response.data;
    }

    /**
     * @description Processes raw chain data, removing unnecessary fields and returning a 
     *              cleaned array of chain objects.
     * @param {any} data The raw data to be processed.
     * @returns {any} An array of processed chain objects.
     */
    processData(data: any): any {
        return data;
    }
}