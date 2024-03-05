/**
 * @description Represents the data structure for an API endpoint.
 */
export interface EndpointConfig {
    endpoint: string;
    dataType: string;
    responseType: 'json' | 'xml'; // TO FIX
}