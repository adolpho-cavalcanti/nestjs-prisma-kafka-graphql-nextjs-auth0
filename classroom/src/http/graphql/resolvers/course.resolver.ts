import { UnauthorizedException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthorizationGuard } from "../../auth/authorization.guard";
import { CreateCourseInput } from "../inputs/create-course-input";
import { Course } from "../models/course";
import { AuthUser, CurrentUser } from "../../auth/current-user";
import { CourseService } from "../../../services/course.service";
import { EnrollmentService } from "../../../services/enrollment.service";
import { StudentService } from "../../../services/student.service";


@Resolver(() => Course)
export class CourseResolver{
    constructor(
        private courseService: CourseService,
        private enrollmentService: EnrollmentService,
        private studentService: StudentService
    ) {}

    @Query(() => [Course])
    @UseGuards(AuthorizationGuard)
    listCourse() {
        return this.courseService.listCourse();
    }

    @Query(() => Course)
    @UseGuards(AuthorizationGuard)
    async courseId(
        @Args('id') id: string,
        @CurrentUser() user: AuthUser
    ) {
        const student = await this.studentService.getStudentByAuthUserId(user.sub);
        if(!student) {
            throw new Error('Estudante não encontrado');
        }

        const enrollment = await this.enrollmentService.getByCourseAndStudentAuthId({
            courseId: id,
            studentId: student.id
        });
        if(!enrollment) {
            throw new UnauthorizedException();
        }

        return this.courseService.getCourseById(id);
    }

    @Mutation(() => Course)
    @UseGuards(AuthorizationGuard)
    createCourse(@Args('data') data: CreateCourseInput) {
        return this.courseService.createCourse(data);
    }
}