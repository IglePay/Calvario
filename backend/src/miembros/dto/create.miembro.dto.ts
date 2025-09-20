import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateMiembroDto {
    @IsOptional() @IsString() dpi?: string;
    @IsString() nombre: string;
    @IsString() apellido: string;
    @IsOptional() @IsString() email?: string;
    @IsOptional() @IsString() telefono?: string;
    @IsOptional() @IsDateString() fechaNacimiento?: string;
    @IsOptional() @IsNumber() idGenero?: number;
    @IsOptional() @IsString() direccion?: string;
    @IsOptional() @IsNumber() idEstado?: number;
    @IsOptional() @IsString() procesosterminado?: string;
    @IsOptional() @IsNumber() idGrupo?: number;
    @IsOptional() @IsString() legusta?: string;
    @IsOptional() @IsDateString() fechaLlegada?: string;
    @IsOptional() @IsDateString() fechaBautismo?: string;
    @IsOptional() @IsNumber() idBautizado?: number;
    @IsOptional() @IsNumber() idServidor?: number;
}
