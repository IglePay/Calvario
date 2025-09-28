import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
    @IsEmail()
    @Transform(({ value }) => value.trim().toLowerCase())
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    // Opcional, para identificar la iglesia/tenant
    @IsOptional()
    @IsString()
    iglesia?: string;
}
