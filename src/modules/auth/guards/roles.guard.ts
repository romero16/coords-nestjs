import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/modules/auth/enums/roles.enum';
import { ROLES_KEY } from 'src/modules/auth/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  
  canActivate(context: ExecutionContext): any {

    const requiredRoles : Role[] = this.reflector.get<Role[]>(ROLES_KEY,
      context.getHandler()
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log(user.role);
    const validRol =  requiredRoles.some((role) => user.role?.includes(role));

   if (validRol)
    return true;
   
   throw new HttpException('Acceso no autorizado!', HttpStatus.UNAUTHORIZED);

  }
}
