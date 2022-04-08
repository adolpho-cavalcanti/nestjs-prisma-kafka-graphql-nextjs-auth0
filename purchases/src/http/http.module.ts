import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import path from 'node:path';

import { DatabaseModule } from '../database/database.module';

import { ProductResolver } from './graphql/resolvers/product.resolver';
import { PurchaseResolver } from './graphql/resolvers/purchase.resolver';
import { CustomerResolver } from './graphql/resolvers/customer.resolver';

import { ProductsService } from '../services/products.service';
import { PurchasesService } from '../services/purchases.service';
import { CustomersService } from '../services/customers.service';
import { MessagingModule } from '../messaging/messaging.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        MessagingModule,
        GraphQLModule.forRoot<ApolloFederationDriverConfig>({
            driver: ApolloFederationDriver,
            autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
        })
    ],
    providers: [
        ProductResolver, 
        PurchaseResolver, 
        CustomerResolver,
        
        ProductsService, 
        PurchasesService,
        CustomersService
    ]
})
export class HttpModule {}
