import {
    IsOptional,
    IsInt,
    Min,
    IsDateString,
    IsString,
} from 'class-validator';

export class UpdateActividadDto {
    @IsOptional()
    @IsString()
    titulo?: string;

    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsOptional()
    @IsDateString()
    fechaActividad?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    idMiembro?: number;

    @IsOptional()
    @IsInt()
    @Min(1)
    idGrupo?: number;
}
