import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import slugify from 'slugify';


interface CreateCourseParams {
    slug?: string;
    title: string;
}

@Injectable()
export class CourseService {
    constructor(
        private prisma: PrismaService
    ) {}

    async listCourse() {
        return await this.prisma.course.findMany();
    }

    async getCourseById(id: string) {
        return await this.prisma.course.findUnique({
            where: { id }
        })
    }

    async getCourseBySlug(slug: string) {
        return await this.prisma.course.findUnique({
            where: { slug }
        })
    }

    async createCourse({ title, slug = slugify(title, { lower: true }) }: CreateCourseParams) {
    
        const courseWithUniqueSlug = await this.prisma.course.findUnique({
            where: { slug }
        });

        if(courseWithUniqueSlug) {
            throw new Error('Já existe um Slug com esse nome');
        }

        return this.prisma.course.create({
            data: {
                title,
                slug
            }
        });
    }
}