import { Module } from '@nestjs/common';
import { CoordsController } from './coords.controller';
import { CoordsService } from './coords.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoordsEntity } from './entity/coords.entity';
import { CommonFilterService } from 'src/shared/common-filter.service';
import { JwtModule } from '@nestjs/jwt';
import { CoordsGateway } from './gateway';

@Module({
  imports: [TypeOrmModule.forFeature([CoordsEntity]),

  JwtModule.register({
      global: true,
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),


],
  controllers: [CoordsController],
  providers: [
    CoordsService,
    CommonFilterService,
    CoordsGateway
  ],
  exports: [CoordsGateway],
})
export class CoordsModule {}
