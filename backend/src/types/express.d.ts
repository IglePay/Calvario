import 'express';

declare global {
    namespace Express {
        interface User {
            sub: number; // idUsuario
            tenantId: number; // aquí declaramos tenantId
            roleId: number; // opcional si usas roles
            email?: string;
        }
    }
}
