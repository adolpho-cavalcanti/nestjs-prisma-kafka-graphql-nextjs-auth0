import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import slugify from 'slugify';


interface CreateCourseParams {
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

    async createCourse({ title }: CreateCourseParams) {
        const slug = slugify(title, {
            lower: true
        });

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