import { UseGuards } from "@nestjs/common";
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { AuthorizationGuard } from "../../auth/authorization.guard";
import { StudentService } from "../../../services/student.service";
import { EnrollmentService } from "../../../services/enrollment.service";
import { Student } from "../models/student";
import { AuthUser, CurrentUser } from "../../auth/current-user";

@Resolver(() => Student)
export class StudentResolver{
    constructor(
        private studentService: StudentService,
        private enrollmentService: EnrollmentService
    ) {}

    @Query(() => Student)
    @UseGuards(AuthorizationGuard)
    me(
        @CurrentUser() user: AuthUser,
    ) {
        return this.studentService.getStudentByAuthUserId(user.sub);
    }
    
    @Query(() => [Student])
    @UseGuards(AuthorizationGuard)
    students() { 
        return this.studentService.listAllStudents();
    }
    
    @ResolveField()
    enrollment(
        @Parent() student: Student
    ) {
        return this.enrollmentService.listEnrollmentByCustumer(student.id)
    }
}