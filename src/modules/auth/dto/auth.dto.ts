import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, Max, MaxLength, MinLength } from "class-validator";
import { Message } from 'src/shared/message.decorator';
import { Timestamp } from "typeorm";

export class AuthDto { 
    @ApiProperty({ example: "Email" })
    @Transform(({value}) => value.trim())
    @MaxLength(50, {
        message: Message.MAX_LENGTH('$property', '$constraint1')
    })
    @MinLength(8,{message: Message.MIN('$property', '$constraint1')})
    email: string;

    @ApiProperty({ example: "Constraseña" })
    @Transform(({value}) => value.trim())
    @MaxLength(30, {
        message: Message.MAX_LENGTH('$property', '$constraint1')
    })
    @MinLength(6,{message: Message.MIN('$property', '$constraint1')})
    password: string;

    // @IsOptional()
    // @MinLength(1,{message: Message.MIN('$property', '$constraint1')})

    // active: boolean;
    
    // @IsOptional()
    // deleted_at: Date | null;

    @IsOptional()
    role: [];

}

export class RefreshTokenDto {
    @ApiProperty({ example: "token" })
    @MinLength(8,{message: Message.MIN('$property', '$constraint1')})
    refresh_token: string;
}