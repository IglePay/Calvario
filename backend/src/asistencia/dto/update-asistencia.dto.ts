import { IsOptional, IsInt, Min, IsDate, IsDateString } from 'class-validator';

export class UpdateAsistenciaDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    cantidadAsistentes: number;

    @IsOptional()
    @IsDateString()
    fechaServicio: string;

    @IsOptional()
    @IsInt()
    idfamilia?: number;

    @IsOptional()
    @IsInt()
    idservicio?: number;
}
