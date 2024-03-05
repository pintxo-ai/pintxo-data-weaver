import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataTypeHandler } from 'src/interfaces/handlers/data-type-handler.interface';
import { ChainCirculatingData, CirculatingData, StablecoinData } from 'src/interfaces/types/stablecoin.interface';

// Utility function for mapping circulating data
function mapCirculatingData(data: CirculatingData): CirculatingData {
    return Object.keys(data).reduce((newData, key) => {
        newData[key] = data[key];
        return newData;
    }, {} as CirculatingData);
}

// Utility function for processing chainCirculating data
function processChainCirculatingData(chainCirculating: ChainCirculatingData): ChainCirculatingData {
    const processed: ChainCirculatingData = {};
    Object.entries(chainCirculating).forEach(([chainName, chainData]) => {
        processed[chainName] = { current: mapCirculatingData(chainData.current) };
    });
    return processed;
}

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
        return parsedData.peggedAssets.map((coin: StablecoinData) => ({
            ...coin,
            circulating: mapCirculatingData(coin.circulating),
            circulatingPrevDay: mapCirculatingData(coin.circulatingPrevDay),
            circulatingPrevWeek: mapCirculatingData(coin.circulatingPrevWeek),
            circulatingPrevMonth: mapCirculatingData(coin.circulatingPrevMonth),
            chainCirculating: processChainCirculatingData(coin.chainCirculating),
        }));
        // const parsedData = JSON.parse(data);

        // // Correctly processing chainCirculating
        // const processedData = parsedData.map((coin: StablecoinData) => {
        //     const chainCirculatingProcessed: ChainCirculatingData = {};
        //     Object.entries(coin.chainCirculating).forEach(([chainName, chainData]) => {
        //         chainCirculatingProcessed[chainName] = { current: chainData.current };
        //     });

        //     return {
        //         ...coin,
        //         chainCirculating: chainCirculatingProcessed,
        //     };
        // });

        // return processedData;

        // const processedData = parsedData.peggedAssets.map((coin: StablecoinData) => {
        //     // Map each circulating data to its new structure, accommodating dynamic keys
        //     const mapCirculatingData = (data: CirculatingData): CirculatingData => {
        //         const newData: CirculatingData = {};
        //         Object.keys(data).forEach(key => {
        //             newData[key] = data[key];
        //         });
        //         //console.log('NEW DATA ::::: ', newData)
        //         return newData;
        //     };

        //     return {
        //         ...coin,
        //         circulating: mapCirculatingData(coin.circulating),
        //         circulatingPrevDay: mapCirculatingData(coin.circulatingPrevDay),
        //         circulatingPrevWeek: mapCirculatingData(coin.circulatingPrevWeek),
        //         circulatingPrevMonth: mapCirculatingData(coin.circulatingPrevMonth),
        //     };
        // });

        // return processedData;
    }
}

