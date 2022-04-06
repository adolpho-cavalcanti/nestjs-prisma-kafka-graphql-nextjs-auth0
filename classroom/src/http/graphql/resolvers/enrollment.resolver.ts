import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { StudentService } from "../../../services/student.service";
import { EnrollmentService } from "../../../services/enrollment.service";
import { CourseService } from "../../../services/course.service";
import { Enrollment } from "../models/enrollment";

@Resolver(() => Enrollment)
export class EnrollmentResolver {
    constructor(
        private enrollmentService: EnrollmentService,
        private studentService: StudentService,
        private courseService: CourseService,
    ) {}

    @ResolveField()
    student(
        @Parent() enrollment: Enrollment
    ) {
        return this.studentService.getStudentById(enrollment.studentId)
    }

    @ResolveField()
    course(
        @Parent() enrollment: Enrollment
    ) {
        return this.courseService.getCourseById(enrollment.courseId)
    }
    
    @Query(() => [Enrollment])
    listAllEnrollment() {
        return this.enrollmentService.listAllEnrollment();
    }
}