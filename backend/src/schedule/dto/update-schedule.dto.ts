import { IsOptional, IsString } from 'class-validator';

export class UpdateSchedulerDto {
    @IsString()
    horario: string;

    @IsString()
    @IsOptional()
    descripcion: string;
}
