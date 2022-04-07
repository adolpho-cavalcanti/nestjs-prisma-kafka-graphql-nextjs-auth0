import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { EnrollmentService } from "../../services/enrollment.service";
import { CourseService } from "../../services/course.service";
import { StudentService } from "../../services/student.service";

export interface Customer {
    authUserId: string;
}

export interface Product {
    id: string;
    title: string;
    slug: string;
}

export interface PurchaseCreatedPayload {
    customer: Customer;
    product: Product;
}


@Controller()
export class PurchasesController {
    constructor(
        private studentService: StudentService,
        private courseService: CourseService,
        private enrollmentService: EnrollmentService
    ){}

    @EventPattern('purchase.create-purchase')
    async purchaseCreated(
        @Payload('value') payload: PurchaseCreatedPayload
    ) {
        let student = await this.studentService.getStudentByAuthUserId(
            payload.customer.authUserId
        );
        if(!student) {
            student = await this.studentService.createStudent({
                authUserId: payload.customer.authUserId
            });
        }

        let course = await this.courseService.getCourseBySlug(
            payload.product.slug
        );
        if(!course) {
            course =  await this.courseService.createCourse({
                title: payload.product.title
            });
        }

        await this.enrollmentService.createEnrollment({
            courseId: course.id,
            studentId: student.id
        })
    }
}