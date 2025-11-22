import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductRestController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    create(@Body() dto: CreateProductDto) {
        return this.productService.createProduct(dto);
    }

    @Get()
    findAll() {
        return this.productService.listProducts();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.getProduct(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.productService.updateProduct(id, dto);
    }

    // ⭐ Added DELETE endpoint
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.productService.deleteProduct(id);
    }
}
