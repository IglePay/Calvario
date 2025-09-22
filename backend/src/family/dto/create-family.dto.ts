import {
    IsInt,
    IsOptional,
    IsString,
    Min,
    IsDateString,
} from 'class-validator';

export class CreateFamilyDto {
    @IsString()
    nombreFamilia: string;

    @IsInt()
    @Min(1)
    cantidadfamilia: number;
}
