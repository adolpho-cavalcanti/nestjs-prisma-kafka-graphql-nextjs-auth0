import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'classroom',
        brokers: ['localhost:29092']
      }
    }
  });

  app.startAllMicroservices().then(() => {
    console.log('Kafka startado');
  })

  app.listen(8081).then(() => {
    console.log('classroom is listening on port 8081')
  })
}
bootstrap();