import { IsOptional, IsString } from 'class-validator';

export class CreateSchedulerDto {
    @IsString()
    horario: string;

    @IsString()
    @IsOptional()
    descripcion: string;
}
