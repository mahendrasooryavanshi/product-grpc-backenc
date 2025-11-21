import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, MinLength } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({ example: 'MacBook Pro' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 150000 })
    @IsNumber()
    @Min(1)
    price: number;

    @ApiProperty({ example: 10 })
    @IsNumber()
    @Min(0)
    stock: number;

    @ApiProperty({ example: 'Apple M3 chipset laptop', required: false })
    @IsOptional()
    @IsString()
    description?: string;
}
