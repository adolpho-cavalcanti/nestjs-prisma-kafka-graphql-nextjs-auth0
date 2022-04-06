import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductsService } from '../../../services/products.service';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { CreateProductInput } from '../inputs/create-product-input';
import { Product } from '../models/product';

@Resolver(() => Product)
export class ProductResolver {
    constructor(private productsService: ProductsService) {}

    @Query(() => [Product])
    listProduct() {
        return this.productsService.listProducts();
    }

    @Mutation(() => Product)
    @UseGuards(AuthorizationGuard)
    createProduct(@Args('data') data: CreateProductInput) {
        return this.productsService.createProduct(data);
    }
}
