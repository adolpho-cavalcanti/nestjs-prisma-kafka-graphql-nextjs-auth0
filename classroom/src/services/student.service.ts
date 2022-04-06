import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";

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
}