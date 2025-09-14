import { IsOptional, IsEmail, IsString, IsDateString } from 'class-validator';

export class UpdateTenantDto {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    dpi?: string;

    @IsOptional()
    @IsString()
    telefono?: string;

    @IsOptional()
    @IsString()
    direccion?: string;

    @IsOptional()
    @IsDateString()
    fecha_inicio?: string; // ISO string
}
