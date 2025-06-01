import { AuthEntity } from './entity/auth.entity';
import { HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto, RefreshTokenDto } from './dto/auth.dto';
import * as bcrytpjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { IsNull } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthEntity,'mysqlConnection') private auth: Repository<AuthEntity>,
        private jwtService: JwtService,
        ) {}


    public async login( {email, password}:AuthDto){
       
            const resp = await this.auth.findOne({
                where: {
                    email: email,
                    // active: true,
                    // deleted_at: IsNull(),
                  },
                  relations: {
                  userRoles: {
                    role: true,
                  },
                },
            });
            if (resp){

              const isMatch = await bcrytpjs.compare(password, resp.password);
              if (isMatch) {
                try {
                  const valid = await bcrytpjs.compare(password, resp.password); 
                  const rolesArray = resp.userRoles?.map(userRole => userRole.role.name) ?? [];

                  const values = {
                    id:resp.id,
                    email:resp.email, 
                    role:rolesArray
                  }
                  const token = await this.jwtService.signAsync(values);
                      const refreshToken = await this.jwtService.signAsync(values, {
                        secret: process.env.JWTKEY_REFRESH,
                        expiresIn: process.env.REFRESH_EXPIRATION,
                      });

                  return {
                      statusCode: valid ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
                      message: valid ? ["Datos obtenidos correctamente."] : ["Credenciales invalidas."],
                      data: valid?   {token:token, refres_token:refreshToken}: [],
                  }
                } catch (error) {
                  return {
                      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                      message: [error.message],
                  };
                }
              } else {
                  return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: ["Credenciales invalidas."],
                    data: [],
                }
              }
            }else{
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: ["Credenciales invalidas."],
                    data: [],
                }
            }
       
    }

    async refreshToken(dto:RefreshTokenDto){
    
      try {
      const data = await this.jwtService.verifyAsync(dto.refresh_token, {
        secret: process.env.JWTKEY_REFRESH,
      });

      const values = {
          id:data.id,
          email:data.email, 
          role:data.role
      }

      const token = await this.jwtService.signAsync(values);

      return {
        statusCode: 200,
        message: ['Token renovado exitosamente'],
        data: {
          token: token,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado.');
    }
  }
}
