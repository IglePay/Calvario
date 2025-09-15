import {
    IsInt,
    IsOptional,
    IsString,
    Min,
    IsDateString,
} from 'class-validator';

export class CreateActividadDto {
    @IsString()
    titulo: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsDateString()
    fechaActividad: string;

    @IsInt()
    @Min(1)
    idMiembro: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    idGrupo?: number;
}
