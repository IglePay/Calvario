import { Prisma } from '@prisma/client';
import {
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';

export function handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            // Violación de unique constraint
            throw new BadRequestException('El registro ya existe');
        }
        if (error.code === 'P2025') {
            // Registro no encontrado
            throw new BadRequestException('Registro no encontrado');
        }
    }
    // Error genérico
    throw new InternalServerErrorException('Error interno en la base de datos');
}
