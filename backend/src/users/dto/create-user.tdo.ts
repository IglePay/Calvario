import { IsNotEmpty, IsEmail, IsString, IsInt } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsInt()
    tenantId: number; // el tenant al que pertenece el usuario

    @IsInt()
    roleId: number; // rol del usuario
}
