import { IsNotEmpty, MinLength, IsString } from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPassword: string; // contraseña actual

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    newPassword: string; // nueva contraseña
}
