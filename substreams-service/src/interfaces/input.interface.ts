export interface Input<T> extends Iterable<T>{
    fields: T; //{ [key: string]: { assign: any }; };
    type: string;
}