/**
 * @description Defines the contract that data handlers must implement
 *              for fetching and processing data. 
 */
export interface DataTypeHandler {
    /**
     * @description Fetches data from a specified endpoint.
     * @param {string} endpoint The URL of the data source.
     * @returns {Promise<any>} A Promise resolving to the fetched data (type may vary).
     */
    fetchData(endpoint: string): Promise<any>;

    /**
     * @description Processes fetched data for a specific data type.
     * @param {any} data The raw or partially processed data to be further transformed.
     * @returns {any}  The processed data (output type dependent on the handler).
     */
    processData(data: any): any;
}