import { SetMetadata } from '@nestjs/common';

export const Permissions = (...permisos: string[]) =>
    SetMetadata('permissions', permisos);
