import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';


@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @GrpcMethod('ProductService', 'CreateProduct')
  createProduct(data: any) {
    // data will match CreateProductDto
    console.log('DATA RECEIVED IN GRPC:', data);
    return this.productService.createProduct(data);
  }

  @GrpcMethod('ProductService', 'GetProduct')
  getProduct(data: any) {
    return this.productService.getProduct(data.id);
  }

  @GrpcMethod('ProductService', 'ListProducts')
  async listProducts() {
    const products = await this.productService.listProducts();
    const mapped = products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      stock: p.stock,
      description: p.description,
    }));

    return { products: mapped };
  }

  // ⭐ NEW UPDATE METHOD
  @GrpcMethod('ProductService', 'UpdateProduct')
  updateProduct(data: any) {
    return this.productService.updateProduct(data.id, data);
  }
}
