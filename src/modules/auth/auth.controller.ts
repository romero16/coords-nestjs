import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthDto, RefreshTokenDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { Role } from 'src/modules/auth/enums/roles.enum';
import { AtuhGuard } from './guards/auth.guard';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService) { }
    @ApiOperation({ summary: 'Autentificacion del usuario' })
    @ApiResponse({
      status: 200,
      type: [AuthDto],
    })
    
    @Post('login')
    async login(@Body() data:AuthDto) {
      return await this.auth.login(data);
    }

    @ApiOperation({ summary: 'Validación de token' })
    @ApiResponse({status: 200, description:'Token generado'})
    @ApiResponse({status: 500, description:'Error al generar el token'})
    @ApiBody({ type: RefreshTokenDto })
    @Post('refresh')
    async refreshToken(@Body() token: RefreshTokenDto) {
      return await this.auth.refreshToken(token);
    }




}
