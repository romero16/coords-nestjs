import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfigService } from './dbconfig.service';

@Module({
    imports: [
        TypeOrmModule.forRoot(
            dbConfigService.getMongoConfig(),)
        ],    
})
export class DbconfigModule {}