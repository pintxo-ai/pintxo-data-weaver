import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
//import { PintxoEngineConnectorModule } from './engine-connector/pintxo-engine-connector.module';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    //PintxoEngineConnectorModule,
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `pintxo-engine-consumer`,
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'pintxo-engine-consumer',
        },
      },
    },
  );
  app.listen();
}
bootstrap();
