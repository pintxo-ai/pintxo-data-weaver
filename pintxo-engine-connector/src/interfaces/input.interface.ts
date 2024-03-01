export interface Input {
    reqUrl: string;
    fields: { 
        [key: string]: { assign: any };
    }; 
    type: string;
}