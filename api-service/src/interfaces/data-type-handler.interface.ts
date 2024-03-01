export interface DataTypeHandler {
    fetchData(endpoint: string): Promise<any>;
    processData(data: any): any;
}