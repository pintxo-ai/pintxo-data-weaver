import { Injectable } from '@nestjs/common';
import { DataTypeHandler } from '../interfaces/handlers/data-type-handler.interface';

/**
 * @description The DataHandlerFactory is responsible for managing the registration
 *              and retrieval of specific data handlers  
 */
@Injectable()
export class DataHandlerFactory {
    /**  @private Stores the registered data handlers, indexed by data type */
    private handlers: { [key: string]: DataTypeHandler } = {};

    /**
     * @description Registers a data handler for a specific data type.
     * @param {string} dataType The key representing the type of data (e.g., 'tokens', 'protocols').
     * @param {DataTypeHandler} handler The handler instance to associate with the data type.
     */
    registerHandler(dataType: string, handler: DataTypeHandler) {
        this.handlers[dataType] = handler;
    }

    /**
     * @description Retrieves the appropriate data handler for a given data type.
     * @param {string} dataType  The key representing the data type.
     * @returns {DataTypeHandler} The corresponding data handler.
     * @throws {Error} If no handler is found for the specified data type.
     */
    getHandler(dataType: string): DataTypeHandler {
        const handler = this.handlers[dataType];
        if (!handler) {
            throw new Error(`No handler found for data type: ${dataType}`);
        }
        return handler;
    }
}