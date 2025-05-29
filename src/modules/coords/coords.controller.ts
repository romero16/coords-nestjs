import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CoordsService } from './coords.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateCoordsDto } from './dto/coords.dto';

import { Request } from 'express';
import { Role } from '../auth/enums/roles.enum';
import { Auth } from '../auth/decorators/auth.decorator';

@ApiBearerAuth()
@Controller('coords')
@ApiTags('Coordenadas')
export class CoordsController {

  constructor(private readonly user: CoordsService) { }

  @ApiOperation({ summary: 'Listado de coordenadas' })
  @Auth(Role.ROOT)
  @ApiResponse({
    status: 200,
    type: [CreateCoordsDto],
  })
  @ApiQuery({
    name: 'page',
    description: 'Número de página',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Limite de elementos',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'search',
    description: 'Texto a buscar',
    type: String,
    required: false,
  })
  @Get('find-all')
  async findAllRegisters() {
    return await this.user.findAllRegisters();
  }

  @ApiOperation({ summary: 'Registrar nueva coordenada' })
  @ApiBody({ type: CreateCoordsDto })
  @Auth(Role.ROOT)
  @Post('save')
  async create(@Body() data:CreateCoordsDto) {
    return await this.user.save(data);
  }


}
