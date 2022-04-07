import { Injectable } from "@nestjs/common";
import { KafkaService } from "../messaging/kafka.service";
import { PrismaService } from "../database/prisma/prisma.service";

interface CreatePurchaseParams {
    customerId: string;
    productId: string;
}

@Injectable()
export class PurchasesService {
    constructor(
        private prisma: PrismaService,
        private kafkaService: KafkaService
    ) {}

    async listAllPurchases() {
        return await this.prisma.purchase.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async listAllFromCustomer(customerId: string) {
        return await this.prisma.purchase.findMany({
            where: {
                customerId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async createPurchase({ customerId, productId }: CreatePurchaseParams) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId}
        });

        if(!product) {
            throw new Error('Produto não encontrado');
        }
        
        const purchase = await this.prisma.purchase.create({
            data: { customerId, productId }
        });

        const customer = await this.prisma.customer.findUnique({
            where: { id: customerId }
        })

        this.kafkaService.emit('purchase.create-purchase', {
            customer: {
                authUserId: customer.authUserId
            },
            product: {
                id: product.id,
                title: product.title,
                slug: product.slug
            }
        })

        return purchase;

    }
}