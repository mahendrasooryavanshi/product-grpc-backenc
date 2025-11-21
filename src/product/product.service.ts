import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schema/product.schema';
// import { Product, ProductDocument } from './product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) { }

  async createProduct(data: any) {
    const product = new this.productModel({
      name: data.name,
      price: data.price,
      stock: data.stock,
      description: data.description ?? '',
    });

    const result = await product.save();
    console.log("product data", result)
    return result
  }

  async getProduct(id: string) {
    return this.productModel.findById(id);
  }

  async listProducts() {
    return this.productModel.find().lean().exec();;
  }

  async reduceStock(productId: string, qty: number) {
    const product = await this.productModel.findById(productId);

    if (!product) return false;
    if (product.stock < qty) return false;

    product.stock -= qty;
    await product.save();

    return true;
  }

  async updateProduct(id: string, dto: any) {
    const updated = await this.productModel.findByIdAndUpdate(
      id,
      { $set: dto },
      {
        new: true,            // return updated document
        runValidators: true,  // ensure DTO validation rules apply
      }
    );

    if (!updated) {
      throw new Error(`Product with id ${id} not found`);
    }

    return updated;
  }
}
