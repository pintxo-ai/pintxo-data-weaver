import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `pintxo-engine-consumer`,
          brokers: ['kafka:9092'],
        },
        consumer: {
          groupId: 'pintxo-engine-consumer', // Consumer options docs https://kafka.js.org/docs/consuming#a-name-options-a-options
        },
      },
    },
  );
  app.listen();
}
bootstrap();
