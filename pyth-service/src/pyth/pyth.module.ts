import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PythService } from './pyth.service';

/// PURPOSE - Defines the PythModule, which acts as a container for the Pyth-related functionality.

// Key Components:
//  imports:
//    ClientsModule.register(...): Sets up a Kafka microservice client configuration with the following:
//    name: 'KAFKA_PYTH_SERVICE' (used for internal reference)
//    transport: Transport.KAFKA (establishes Kafka communication)
//    options:
//    client.clientId: 'pyth-price-updates' (identifies the client)
//    client.brokers: ['kafka:9092'] (specifies Kafka broker address)
//  providers:
//    PythService: Registers the PythService as a provider, making it available for dependency injection throughout this module and any modules that import the PythModule.
//  exports:
//    PythService: Exports the PythService to make it accessible to other modules that import the PythModule

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_PYTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'pyth-price-updates',
            brokers: ['kafka:9092'], 
          },
        },
      },
    ]),
  ],
  providers: [PythService],
  exports: [PythService],
})
export class PythModule {}

