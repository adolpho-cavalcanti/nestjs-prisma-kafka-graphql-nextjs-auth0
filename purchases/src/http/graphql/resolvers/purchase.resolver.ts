import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { AuthUser, CurrentUser } from '../../auth/current-user';
import { ProductsService } from '../../../services/products.service';
import { PurchasesService } from '../../../services/purchases.service';
import { CustomersService } from '../../../services/customers.service';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { CreatePurchaseInput } from '../inputs/create-purchase-input';
import { Purchase } from '../models/purchase';
import { PrismaService } from 'src/database/prisma/prisma.service';



@Resolver(() => Purchase)
export class PurchaseResolver {
    constructor(
        private purchasesService: PurchasesService,
        private productsService: ProductsService,
        private customersService: CustomersService,
        private prisma: PrismaService,
    ) {}

    @Query(() => [Purchase])
    @UseGuards(AuthorizationGuard)
    listAllPurchases() {
        return this.purchasesService.listAllPurchases()
    }

    @ResolveField()
    product(
        @Parent() purchase: Purchase
    ) {
        return this.productsService.getProductById(purchase.productId)
    }

    @Mutation(() => Purchase)
    @UseGuards(AuthorizationGuard)
    async createPurchase(
        @Args('data') data: CreatePurchaseInput,
        @CurrentUser() user: AuthUser
    ) {
        let customer = await this.customersService.getCustomerByAuthUserId(user.sub);

        if(!customer) {
            customer = await this.customersService.createCustomer({
                authUserId: user.sub
            })
        }

        return this.purchasesService.createPurchase({ 
            customerId: customer.id,
            productId: data.productId 
        });
    }

    
}
