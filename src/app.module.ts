import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './core/exception.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfigService } from './config/dbconfig/dbconfig.service';
import { CoordsModule } from './modules/coords/coords.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),

    // Conexión MySql
    TypeOrmModule.forRoot(dbConfigService.getMysqlConfig()),

    // Conexión MongoDB
    TypeOrmModule.forRoot(dbConfigService.getMongoConfig()),

    CoordsModule,
    AuthModule
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}