import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsDateString,
} from 'class-validator';

export class CreateFundDto {
    @IsInt()
    idnomeclatura: number;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsDateString()
    fecha: string;

    @IsNotEmpty()
    @IsNumber()
    monto: number;
}
