import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataTypeHandler } from 'src/interfaces/handlers/data-type-handler.interface';
import { StablecoinData } from 'src/interfaces/types/stablecoin.interface';

/**
 * @description The StablecoinHandler is responsible for fetching and processing
 *              data related to stablecoins from external endpoints.
 */
@Injectable()
export class StablecoinHandler implements DataTypeHandler {

    /**
     * @description Fetches raw stablecoin data from a specified endpoint.
     * @param {string} endpoint The URL of the endpoint providing stablecoin data.
     * @returns {Promise<string>} A Promise resolving to a stringified representation
     *                            of the fetched stablecoin data.
     */
    async fetchData(endpoint: string): Promise<string> {
        const response = await axios.get<StablecoinData[]>(endpoint);
        return JSON.stringify(response.data);
    }

    /**
     * @description Processes raw stablecoin data, removing unnecessary fields and returning a 
     *              cleaned array of stablecoin objects.
     * @param {any} data The raw data to be processed.
     * @returns {any} An array of processed stablecoin objects.
     */
    processData(data: any): any {
        const parsedData = JSON.parse(data);

        return parsedData.peggedAssets;
    }
}

