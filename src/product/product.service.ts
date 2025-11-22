import { Injectable, Logger } from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { success, fail } from 'src/common/response.helper';
import { UpdateProductDto } from './dto/update-product.dto';
import { MongoProduct } from 'src/common/interfaces/productList.interface';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(private readonly repo: ProductRepository) { }

  // ------------------ CREATE PRODUCT ------------------
  async createProduct(dto: CreateProductDto) {
    this.logger.debug(`CreateProduct | Payload: ${JSON.stringify(dto)}`);
    const product = await this.repo.create(dto);
    return success(product, 'Product created successfully');
  }

  // ------------------ GET PRODUCT BY ID ------------------
  async getProduct(id: string) {
    this.logger.debug(`GetProduct | ID: ${id}`);

    const p = await this.repo.findById(id) as MongoProduct;
    if (!p) {
      return {
        success: false,
        message: 'Product not found',
        data: {},  // ❗NOT null
      };
    }

    return success({
      id: p._id.toString(),   // 👉 yahi se ID milegi
      name: p.name,
      price: p.price,
      stock: p.stock,
      description: p.description,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }, 'Product fetched successfully');
  }

  // ------------------ LIST ALL PRODUCTS ------------------
  async listProducts() {
    this.logger.debug(`ListProducts`);
    const products = await this.repo.findAll() as MongoProduct[];

    const formatted = products.map(p => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      stock: p.stock,
      description: p.description,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    if (!formatted.length) {
      return success([], 'No products found');
    }
    return success(formatted, 'Products fetched successfully');
  }

  // ------------------ REDUCE STOCK (Used by Orders MS) ------------------
  async reduceStock(productId: string, qty: number) {
    this.logger.debug(`ReduceStock | ID: ${productId} | Qty: ${qty}`);

    const product = await this.repo.findById(productId);
    if (!product) {
      return { success: false, message: 'Product not found', data: null };
    }

    if (product.stock < qty) {
      return { success: false, message: 'Insufficient stock', data: null };
    }

    const updatedStock = product.stock - qty;
    await this.repo.update(productId, { stock: updatedStock });

    return {
      success: true,
      message: 'Stock reduced successfully',
      data: { id: productId, stock: updatedStock },
    };
  }


  // ------------------ UPDATE PRODUCT ------------------
  async updateProduct(id: string, dto: UpdateProductDto) {
    this.logger.debug(
      `UpdateProduct | ID: ${id} | Payload: ${JSON.stringify(dto)}`
    );

    const updated = await this.repo.update(id, dto);

    if (!updated) return fail('Product not found');

    return success(updated, 'Product updated successfully');
  }

  // ------------------ DELETE PRODUCT ------------------
  async deleteProduct(id: string) {
    this.logger.debug(`DeleteProduct | ID: ${id}`);

    const deletedCount = await this.repo.delete(id);

    if (deletedCount === 0) return fail('Product not found');

    return success(true, 'Product deleted successfully');
  }


}


