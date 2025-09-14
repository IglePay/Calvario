import {
    IsOptional,
    IsString,
    IsEmail,
    MinLength,
    IsInt,
} from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsInt()
    tenantId?: number;

    @IsOptional()
    @IsInt()
    roleId?: number;
}
