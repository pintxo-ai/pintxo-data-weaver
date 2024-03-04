import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataTypeHandler } from 'src/interfaces/data-type-handler.interface';

@Injectable()
export class ChainHandler implements DataTypeHandler {
    async fetchData(endpoint: string) {
        const response = await axios.get(endpoint);
        return response.data;
    }

    processData(data: any): any {
        // todo implement transofmrations
        return data;
    }
}