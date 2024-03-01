import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DataTypeHandler } from 'src/interfaces/data-type-handler.interface';
import { ProtocolEntry } from 'src/interfaces/protocol.interface';

@Injectable()
export class ProtocolHandler implements DataTypeHandler {
    async fetchData(endpoint: string): Promise<string> {
        const response = await axios.get<ProtocolEntry[]>(endpoint);
        // only stringify the data part of the response
        return JSON.stringify(response.data);
    }

    processData(data: any): any {
        const parsedData = JSON.parse(data);

        const fieldsToRemove = ['logo', 'audits', 'audit_note', 'module', 'audit_links', 'slug', 'governanceID'];

        const cleanedData = parsedData.map((entry: ProtocolEntry) => {
            fieldsToRemove.forEach(field => {
                delete entry[field];
            });
            return entry;
        });

        //console.log('clean - ', cleanedData);
        return cleanedData;
    }
}
// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import { DataTypeHandler } from 'src/interfaces/data-type-handler.interface';
// import { ProtocolEntry } from 'src/interfaces/protocol.interface';

// @Injectable()
// export class ProtocolHandler implements DataTypeHandler {
//     async fetchData(endpoint: string) {
//         const response: ProtocolEntry[] = await axios.get(endpoint);
//         return JSON.stringify(response);
//     }

//     processData(data: any): any {
//         // fields to remove from each entry
//         const fieldsToRemove = ['logo', 'description', 'audit_links', 'governanceID'];

//         const cleanedData = data.map(entry => {
//             fieldsToRemove.forEach(field => {
//                 delete entry[field];
//             });
//             return entry;
//         });
//         console.log('clean - ', cleanedData)
//         return cleanedData;
//     }
// }