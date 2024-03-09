import { Injectable, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
// import * as fs from 'fs';
import { promises as fs } from 'fs';
import * as path from 'path';
import { DataProcessingProcessor } from 'src/interfaces/data-processing-processor.interface';
import { Input } from 'src/interfaces/input.interface';
import { ProcessorFactory } from 'src/processors/processor-factory';
//import { DataProcessingStrategyFactory } from 'src/processors/processor-strategy-factory';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

@Injectable()
export class PintxoEngineConnectorService implements OnModuleInit {
  //constructor(private strategyFactory: DataProcessingStrategyFactory) { }

  private processor: DataProcessingProcessor;

  async onModuleInit() {
    console.log(`
    ____  ___  _________       _       ___________ _    ____________ 
   / __ \/   |/_  __/   |     | |     / / ____/   | |  / / ____/ __ \
  / / / / /| | / / / /| |_____| | /| / / __/ / /| | | / / __/ / /_/ /
 / /_/ / ___ |/ / / ___ /_____/ |/ |/ / /___/ ___ | |/ / /___/ _, _/ 
/_____/_/  |_/_/ /_/  |_|     |__/|__/_____/_/  |_|___/_____/_/ |_|  
                                                                                                                                               
  `);
  }

  async processData(topic: string, message: any) {
    this.processor = ProcessorFactory.getProcessor(topic);
    const processedData: Input = this.processor.processData(message)

    // log to text file
    // await this.logToFile(data);

    // upload processed data
    await this.uploadData(processedData, topic);
  }

  // private async logToFile(data: any) {
  //   const logFilePath = path.join(__dirname, 'logs', 'dataLog.txt');
  //   await fs.appendFile(logFilePath, JSON.stringify(data) + '\n');
  // }

  async uploadData(processedData: Input, topic: string) {
    //console.log(`INJECTING ${topic} data --- ${processedData}`)

    //await delay(60000);
    try {
      await axios.put(processedData.reqUrl, { fields: processedData.fields }, { headers: { 'Content-Type': 'application/json' } });
      console.log(`${topic} data uploaded successfully`);
    } catch (error) {
      console.error(`Failed to upload:`, error);
    }
  }

  async updateData(processedData: Input, topic: string) {
    try {
      await axios.put(processedData.reqUrl, 
        { 
          update: "id:namespace:doctype::1", // to fix - MUST ABSTRACT THE WAY ID IS CHOSEN
          fields: processedData.fields 
        }, 
        { 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
      console.log(`${topic} data uploaded successfully`);
    } catch (error) {
      console.error(`Failed to upload:`, error);
    }
  }
}