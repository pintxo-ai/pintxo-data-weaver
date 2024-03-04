import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { DataHandlerFactory } from '../data-handler-factory';

/**
 * The ApiModule configures NestJS services related to data fetching, publishing, and the Kafka client for communication.
 */
@Module({
  imports: [
    // ScheduleModule for scheduling tasks
    ScheduleModule.forRoot(),
    // ClientsModule for registering the Kafka client
    ClientsModule.register([
      {
        name: 'KAFKA_API_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-service', // Unique ID for this microservice client 
            brokers: ['kafka:9092'], // Kafka broker address(es)
          },
          consumer: {
            groupId: 'pintxo-microservices', // Consumer group for coordination
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
  ],
  controllers: [ApiController], // controller for api
  providers: [ApiService, DataHandlerFactory], // services the module provides
})
export class ApiModule {}