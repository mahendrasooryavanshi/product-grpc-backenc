import { Controller, UsePipes, ValidationPipe, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('product')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) { }

  // ------------------ CREATE PRODUCT ------------------
  @GrpcMethod('ProductService', 'CreateProduct')
  async createProduct(data: { createProductRequest?: CreateProductDto } | CreateProductDto) {
    const payload = this.unwrap(data);
    this.logger.debug(`CreateProduct Request: ${JSON.stringify(payload)}`);
    return await this.productService.createProduct(payload);

  }

  // ------------------ GET PRODUCT ------------------
  @GrpcMethod('ProductService', 'GetProduct')
  async getProduct(data: { id: string }) {
    this.logger.debug(`GetProduct Request: ${JSON.stringify(data)}`);
    return await this.productService.getProduct(data.id);
  }

  // ------------------ LIST PRODUCTS ------------------
  @GrpcMethod('ProductService', 'ListProducts')
  async listProducts() {
    this.logger.debug(`ListProducts Request`);
    return await this.productService.listProducts();
  }

  // ------------------ UPDATE PRODUCT ------------------
  @GrpcMethod('ProductService', 'UpdateProduct')
  async updateProduct(data: { id: string; updateProductRequest?: UpdateProductDto } | any) {
    const { id, ...rest } = this.unwrap(data);
    this.logger.debug(`UpdateProduct Request: ID: ${id}, Body: ${JSON.stringify(rest)}`);
    return await this.productService.updateProduct(id, rest);
  }

  // ------------------ DELETE PRODUCT ------------------
  @GrpcMethod('ProductService', 'DeleteProduct')
  async deleteProduct(data: { id: string }) {
    this.logger.debug(`DeleteProduct Request: ${JSON.stringify(data)}`);
    return await this.productService.deleteProduct(data.id);
  }

  private unwrap(data: any): any {
    if (!data) return {};
    const keys = Object.keys(data);
    const wrapperKey = keys.find(k => k.toLowerCase().includes('request'));
    return wrapperKey ? data[wrapperKey] : data;
  }

  @GrpcMethod('ProductService', 'ReduceStock')
  async reduceStock(data: { id: string; quantity: number }) {
    return this.productService.reduceStock(data.id, data.quantity);
  }
}
