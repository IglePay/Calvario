import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    IsInt,
    IsOptional,
} from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    // Para registrar el tenant de manera explícita
    @IsInt()
    @IsOptional()
    tenantId?: number;

    @IsInt()
    @IsOptional()
    roleId?: number;
}
