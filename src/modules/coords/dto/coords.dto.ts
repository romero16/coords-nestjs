import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, Min, Max, IsOptional } from 'class-validator';
import { Message } from 'src/shared/message.decorator';

export class CreateCoordsDto {

    @IsOptional()
    id: number;
    @ApiProperty({ example: 19.4326, description: 'Latitud del punto' })
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({}, { message: Message.NUMBER('$property') })
    @Min(-90, { message: Message.MIN('$property', '$constraint1') })
    @Max(90, { message: Message.MAX('$property', '$constraint1') })
    lat: number;

    @ApiProperty({ example: -99.1332, description: 'Longitud del punto' })
    @Transform(({ value }) => parseFloat(value))
    @IsNumber({}, { message: Message.NUMBER('$property') })
    @Min(-180, { message: Message.MIN('$property', '$constraint1') })
    @Max(180, { message: Message.MAX('$property', '$constraint1') })
    lng: number;
}
