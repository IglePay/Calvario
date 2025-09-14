import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    // Opcional, para identificar la iglesia/tenant
    @IsOptional()
    @IsString()
    iglesia?: string;
}
