import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import path from 'node:path';

import { CourseService } from '../services/course.service';
import { EnrollmentService } from '../services/enrollment.service';
import { StudentService } from '../services/student.service';

import { DatabaseModule } from '../database/database.module';
import { CourseResolver } from './graphql/resolvers/course.resolver';
import { EnrollmentResolver } from './graphql/resolvers/enrollment.resolver';
import { StudentResolver } from './graphql/resolvers/student.resolver';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            autoSchemaFile: path.resolve(process.cwd(), 'src/schema.gql'),
        })
    ],
    providers: [
        EnrollmentResolver,
        StudentResolver,
        CourseResolver,

        CourseService,
        EnrollmentService,
        StudentService
    ]
})
export class HttpModule {}
