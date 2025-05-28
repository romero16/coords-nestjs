import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonFilterService } from 'src/shared/common-filter.service';
import { CoordsEntity } from './entity/coords.entity';
import { Repository } from 'typeorm';
import { FilterOperator, PaginateConfig, PaginateQuery, paginate } from 'nestjs-paginate';
import { CreateCoordsDto } from './dto/coords.dto';
import * as bcrytpjs from 'bcryptjs';
import { CoordsGateway } from './gateway';

@Injectable()
export class CoordsService {

    constructor(
        @InjectRepository(CoordsEntity) private coords: Repository<CoordsEntity>,
        private readonly coordsGateway: CoordsGateway
      ) {}

      async findAllRegisters(): Promise<any> {
         try {
            const data = await this.coords.findAndCount();
             return {
              statusCode: data[0].length > 0 ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
              message: data[0].length > 0  ? ['Datos obtenidos correctamente.'] : ['No se encontraron registros.'],
              data:data[0].length > 0  ? data[0] : [],
              count: data[1],
            };

          } catch (error) {
            return {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: error.message,
              data: null,
            };
          }
  
      }

      async save( data:CreateCoordsDto){
     
        try {
          const res = await this.coords.save(data)

          this.coordsGateway.emitCoordsCreate(data);
    
          return {
            statusCode: res ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
            message: res ? ["Registro creado correctamente."] : ["Ocurrio un error al crear el registro"],
            data: res ? res : [],
          }
          } catch (error) {
            return {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              message: [error.message],
            };
          }
      }
    
}
