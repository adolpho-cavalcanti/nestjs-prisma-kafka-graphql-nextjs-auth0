import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma/prisma.service";
import slugify from 'slugify';

interface CreateProductParams {
    title: string;
}

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) {}

    async listProducts() {
        return await this.prisma.product.findMany();
    }

    async getProductById(id: string) {
        return await this.prisma.product.findUnique({
            where: { id }
        })
    }

    async createProduct({ title }: CreateProductParams) {
        const slug = slugify(title, {
            lower: true
        });

        const productWithUniqueSlug = await this.prisma.product.findUnique({
            where: { slug }
        });

        if(productWithUniqueSlug) {
            throw new Error('Já existe um Slug com esse nome');
        }

        return this.prisma.product.create({
            data: {
                title,
                slug
            }
        });
    }
}