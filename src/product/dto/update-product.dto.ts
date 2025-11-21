import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiPropertyOptional()
    name?: string;

    @ApiPropertyOptional()
    price?: number;

    @ApiPropertyOptional()
    stock?: number;

    @ApiPropertyOptional()
    description?: string;
}
