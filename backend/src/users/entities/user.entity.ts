export class User {
    idUsuario: number;
    idTenant: number;
    nombre: string;
    email: string;
    password: string; // encriptada con bcrypt
    idRol: number;
    fechaCreacion: Date;
}
