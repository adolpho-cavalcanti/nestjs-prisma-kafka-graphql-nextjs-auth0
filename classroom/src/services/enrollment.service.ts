import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";

interface GetByCourseAndStudentAuthIdParams {
    courseId: string;
    studentId: string;
}

@Injectable()
export class EnrollmentService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getByCourseAndStudentAuthId({ courseId, studentId}: GetByCourseAndStudentAuthIdParams) {
        return await this.prisma.enrollment.findFirst({
            where: {
                courseId,
                studentId,
                
                canceleddAt: null
            }
        });
    }

    async listAllEnrollment() {
        return await this.prisma.enrollment.findMany({
            where: {
                canceleddAt: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async listEnrollmentByCustumer(studentId: string) {
        return await this.prisma.enrollment.findMany({
            where: { 
                studentId,
                canceleddAt: null
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }
}