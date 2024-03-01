import { Injectable } from '@nestjs/common';
import { DataTypeHandler } from './interfaces/data-type-handler.interface';

@Injectable()
export class DataHandlerFactory {
    private handlers: { [key: string]: DataTypeHandler } = {};

    registerHandler(dataType: string, handler: DataTypeHandler) {
        this.handlers[dataType] = handler;
    }

    getHandler(dataType: string): DataTypeHandler {
        const handler = this.handlers[dataType];
        if (!handler) {
            throw new Error(`No handler found for data type: ${dataType}`);
        }
        return handler;
    }
}