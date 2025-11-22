import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { getConnectionToken } from '@nestjs/mongoose';

async function bootstrap() {
  // gRPC
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'product',
        protoPath: join(__dirname, './product/product.proto'),
        url: '0.0.0.0:50051',
      },
    },
  );
  grpcApp.listen();

  // HTTP
  const app = await NestFactory.create(AppModule);

  // ⬇ Wait for Nest to initialize Mongoose
  const connection = app.get(getConnectionToken());

  connection.on('connected', () => {
    console.log('🟢 MongoDB Connected Successfully');
  });

  connection.on('error', (err) => {
    console.log('🔴 MongoDB Connection Error:', err.message);
  });

  connection.on('disconnected', () => {
    console.log('🟡 MongoDB Disconnected');
  });

  await app.listen(3001);
  console.log('📘 Swagger available at http://localhost:3001/docs');
}

bootstrap();
