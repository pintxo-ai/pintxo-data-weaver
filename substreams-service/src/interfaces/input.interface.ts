export interface Input<T> extends Iterable<T>{
    fields: T;
    type: string;
}