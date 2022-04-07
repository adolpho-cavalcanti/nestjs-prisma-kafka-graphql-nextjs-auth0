import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";

interface CreateStudentParams {
    authUserId: string;
}

@Injectable()
export class StudentService {
    constructor(
        private prisma: PrismaService
    ) {}

    listAllStudents() {
        return this.prisma.student.findMany();
    }

    async getStudentByAuthUserId(authUserId: string) {
        return await this.prisma.student.findUnique({
            where: { 
                authUserId
             }
        });
    }

    async getStudentById(id: string) {
        return await this.prisma.student.findUnique({
            where: { id }
        })
    }

    async createStudent({ authUserId }: CreateStudentParams) {
        return await this.prisma.student.create({
            data: { authUserId }
        })
    }
}