import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataTypeHandler } from 'src/interfaces/handlers/data-type-handler.interface';
import { ProtocolData } from 'src/interfaces/types/protocol.interface';

/**
 * @description The ProtocolHandler is responsible for fetching and processing
 *              data related to protocols from external endpoints.
 */
@Injectable()
export class ProtocolHandler implements DataTypeHandler {

    /**
     * @description Fetches raw protocol data from a specified endpoint.
     * @param {string} endpoint The URL of the endpoint providing protocol data.
     * @returns {Promise<string>} A Promise resolving to a stringified representation
     *                            of the fetched protocol data.
     */
    async fetchData(endpoint: string): Promise<string> {
        const response = await axios.get<ProtocolData[]>(endpoint);
        // only stringify the data part of the response
        return JSON.stringify(response.data);
    }

    /**
     * @description Processes raw protocol data, removing unnecessary fields and returning a 
     *              cleaned array of protocol objects.
     * @param {any} data The raw data to be processed.
     * @returns {any} An array of processed protocol objects.
     */
    processData(data: any): any {
        const parsedData = JSON.parse(data);

        const fieldsToRemove = ['logo', 'audits', 'audit_note', 'module', 'audit_links', 'forkedFrom', 'listedAt', 'github', 'treasury', 'oracles', 'slug', 'methodology', 'governanceID', 'tokenBreakdowns'];

        const cleanedData = parsedData.map((entry: ProtocolData) => {
            fieldsToRemove.forEach(field => {
                delete entry[field];
            });
            return entry;
        });

        return cleanedData;
    }
}