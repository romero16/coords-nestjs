import { UseGuards, applyDecorators } from "@nestjs/common";
import { Role } from "src/modules/auth/enums/roles.enum";
import { Roles } from "./roles.decorator";
import { AtuhGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";

export function Auth(...roles:Role[]){
    return applyDecorators(
        Roles(...roles),
        UseGuards(AtuhGuard , RolesGuard)
    )
}