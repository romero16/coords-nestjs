import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { RoleEntity } from './entity/role.entity';
import { ModelHasRolesEntity } from './entity/model.has.roles.entity';
dotenv.config();

@Module({
  imports:[
    TypeOrmModule.forFeature([AuthEntity, RoleEntity,ModelHasRolesEntity],'mysqlConnection'),
    JwtModule.register({
      global: true,
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
],
  controllers: [AuthController],
  providers: [
    AuthService
  ]
})
export class AuthModule {}
