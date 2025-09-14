import { IsOptional, IsInt, Min, IsDateString } from 'class-validator';

export class UpdateLimpiezaDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    idMiembro?: number;

    @IsOptional()
    @IsDateString()
    fechaLimpieza?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    idGrupo?: number;
}
