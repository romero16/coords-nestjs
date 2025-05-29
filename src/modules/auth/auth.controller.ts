import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthDto, NewPassword, RecoveryPasswordDto, ValidateTokenDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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


    @MessagePattern({ cmd: 'validateToken' })
    @ApiOperation({ summary: 'Validación de token' })
    @ApiResponse({status: 200, description:'Correo enviado'})
    @ApiResponse({status: 500, description:'Correo no enviado'})
    @ApiParam({ name: 'token', description: 'token a validar', })
    @Get('validate-token/:token')
    async validateToken(@Param('token') token: string) {
      return await this.auth.validateToken(token);
    }




}
