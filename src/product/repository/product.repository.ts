import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schema/product.schema';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class ProductRepository {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>,
    ) { }

    // CREATE
    async create(data: CreateProductDto): Promise<any> {
        const product = new this.productModel(data);
        console.log("---- REPO DEBUG START ----");

        console.log("product:", product);
        console.log("typeof product.save:", typeof product.save);
        console.log("product.save:", product.save);

        const saved = await product.save();

        console.log("saved:", saved);
        console.log("---- REPO DEBUG END ----");
        return await product.save();

    }

    // FIND ALL
    async findAll(): Promise<Product[]> {
        return this.productModel.find().lean().exec();
    }

    // FIND ONE
    async findById(id: string): Promise<Product | null> {
        return this.productModel.findById(id).lean().exec();
    }

    // UPDATE
    async update(id: string, data: UpdateProductDto): Promise<Product | null> {
        return this.productModel
            .findByIdAndUpdate(id, data, { new: true })
            .lean()
            .exec();
    }

    // DELETE
    async delete(id: string): Promise<number> {
        const result = await this.productModel.deleteOne({ _id: id }).exec();
        return result.deletedCount ?? 0;
    }
}
