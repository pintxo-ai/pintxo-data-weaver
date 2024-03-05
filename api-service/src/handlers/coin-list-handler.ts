import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataTypeHandler } from 'src/interfaces/handlers/data-type-handler.interface';

/**
 * @description The CoinListHandler is responsible for fetching and processing
 *              data related to tokens from external endpoints.
 */
@Injectable()
export class CoinListHandler implements DataTypeHandler {

    /**
     * @description Fetches raw coin-list data from a specified endpoint.
     * @param {string} endpoint The URL of the endpoint providing coin-list data.
     * @returns {Promise<string>} A Promise resolving to a stringified representation
     *                            of the fetched coin-list data.
     */
    async fetchData(endpoint: string) {
        const response = await axios.get(endpoint);
        return response.data;
    }

    /**
     * @description Processes raw coin-list data, removing unnecessary fields and returning a 
     *              cleaned array of coin-list objects.
     * @param {any} data The raw data to be processed.
     * @returns {any} An array of processed coin-list objects.
     */
    processData(data: any): any {
        return data;
    }
}