import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import config from './config/config';
import { JsonContentTypeMiddleware } from './middleware/json-content-type.middleware';
import { LeaveModule } from './modules/leave/leave.module';
import { LeavePolicyModule } from './modules/leavePolicies/leavePolicies.module';
import { HolidayModule } from './modules/holiday/holiday.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/startegy/jwt.strategy';
import { ProjectModule } from './modules/project/project.module';
import { ResignationModule } from './modules/resignation/resignation.module';
import { AssetsModule } from './modules/CompanyAssets/assets.module';
import { OffboardingModule } from './modules/offboarding/offboarding.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
      expandVariables: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString')
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    UserModule,
    LeaveModule,
    LeavePolicyModule,
    HolidayModule,
    ProjectModule,
    ResignationModule,
    AssetsModule,
    OffboardingModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JsonContentTypeMiddleware).forRoutes('*')
  }
}
