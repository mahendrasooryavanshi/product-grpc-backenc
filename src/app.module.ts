import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import mongoConfig from './config/db.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongo = configService.get('mongo');

        console.log(`🔗 Connecting to MongoDB at: ${mongo.uri}/${mongo.dbName}`);

        return {
          uri: mongo.uri,
          dbName: mongo.dbName,
          retryAttempts: mongo.retryAttempts,
          retryDelay: mongo.retryDelay,
        };
      },
    }),

    ProductModule,
  ],
})
export class AppModule { }
