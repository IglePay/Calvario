import {
    IsOptional,
    IsString,
    IsInt,
    Min,
    IsDate,
    IsDateString,
} from 'class-validator';

export class CreateAsistenciaDto {
    @IsInt()
    @Min(1)
    cantidadAsistentes: number;

    @IsOptional()
    @IsDateString()
    fechaServicio: string;

    @IsInt()
    idfamilia: number;

    @IsInt()
    idservicio: number;
}
