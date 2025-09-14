import { IsInt, IsDateString, Min, IsOptional } from 'class-validator';

export class CreateLimpiezaDto {
    @IsInt()
    @Min(1)
    idMiembro: number;

    @IsDateString()
    fechaLimpieza: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    idGrupo?: number;
}
