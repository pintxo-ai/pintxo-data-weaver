import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubstreamsController } from './substreams.controller.js';
import { SubstreamsService } from './substreams.service.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SUBSTREAMS_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'substreams-service',
            brokers: ['kafka:9092'],
          },
        },
      },
    ]),
  ],
  controllers: [SubstreamsController],
  providers: [SubstreamsService],
})
export class SubstreamsModule {}
