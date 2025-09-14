import { IsOptional, IsEmail, IsString, IsDateString } from 'class-validator';

export class UpdateGrupoDto {
    @IsOptional()
    @IsString()
    nombregrupo?: string;
}
