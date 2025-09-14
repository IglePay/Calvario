import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateGrupoDto {
    @IsString()
    nombregrupo: string;
}
