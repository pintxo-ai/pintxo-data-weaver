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
          consumer: {
            groupId: 'pintxo-microservices', // is this wrong?? should be producer but why does it work?
          },
        },
      },
    ]),
  ],
  controllers: [SubstreamsController], //needed ?
  providers: [SubstreamsService],
})
export class SubstreamsModule {}
