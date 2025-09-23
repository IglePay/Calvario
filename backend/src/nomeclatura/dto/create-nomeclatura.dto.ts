import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNomeclaturaDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    codigo: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    nombre: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(10)
    tipoIE: string;
}
