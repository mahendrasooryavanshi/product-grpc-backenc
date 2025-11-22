import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRestController } from './product.rest.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { ProductRepository } from './repository/product.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [ProductController, ProductRestController], // ← Add here
  providers: [ProductService, ProductRepository],
  exports: [ProductService, ProductRepository], // Optional
})
export class ProductModule { }
