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
    @IsOptional() @IsDateString() fechaLlegada?: string; // antes anioLlegada
    @IsOptional() @IsString() procesosTerminado?: string;
    @IsOptional() @IsNumber() idGrupo?: number;
    @IsOptional() @IsString() leGusta?: string;
    @IsOptional() @IsNumber() idBautizado?: number; // FK a tb_bautizados
    @IsOptional() @IsNumber() idServidor?: number; // FK a tb_servidores
}
