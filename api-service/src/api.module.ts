import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { DataHandlerFactory } from './data-handler-factory';

//import { CompressionTypes } from 'kafkajs';
import { CompressionTypes } from '@nestjs/microservices/external/kafka.interface';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'KAFKA_API_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-service',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'pintxo-microservices',
          },
          producer: {
            allowAutoTopicCreation: true,
            //maxRequestSize: 1048576,
            // compression: CompressionTypes.GZIP, // enable GZIP compression
          },
        },
      },
    ]),
  ],
  controllers: [ApiController], //needed ?
  providers: [ApiService, DataHandlerFactory],
})
export class ApiModule {}