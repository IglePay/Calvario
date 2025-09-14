import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    IsEmail,
} from 'class-validator';

export class CreateTenantDto {
    @IsString()
    @IsNotEmpty()
    dpi: string;

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsDateString()
    fecha_inicio?: string;

    @IsOptional()
    @IsString()
    direccion?: string;
}
