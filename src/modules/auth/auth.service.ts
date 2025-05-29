import { AuthEntity } from './entity/auth.entity';
import { HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthDto, NewPassword, RecoveryPasswordDto, ValidateTokenDto } from './dto/auth.dto';
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
                    active: true,
                    deleted_at: IsNull(),
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
                  const token = await this.jwtService.signAsync({id:resp.id,name:resp.name, email:resp.email, role:rolesArray});
                  return {
                      statusCode: valid ? HttpStatus.OK : HttpStatus.BAD_REQUEST,
                      message: valid ? ["Datos obtenidos correctamente."] : ["Credenciales invalidas."],
                      data: valid? token: [],
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


    async validateToken(token:string){
          try {
            const payload = await this.jwtService.verifyAsync(
              token,
              {
                secret: process.env.JWTKEY
              }
            );
            return {
                statusCode: HttpStatus.OK,
                message: ["Token válido!"],
                data: payload,
            }
          } catch {
            return {
                statusCode: HttpStatus.UNAUTHORIZED,
                message: ["El token no es válido!"],
            }
          }
    }
}
