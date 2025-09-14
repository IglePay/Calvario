- paquetes inistalados
  pnpm add @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
  pnpm add -D @types/passport-jwt @types/bcrypt
- pnpm add @prisma/client
  pnpm add -D prisma

## Description
Admin global: puede ver y crear usuarios en todos los tenants.

Pastor: puede administrar usuarios dentro de su tenant.

Miembro: solo puede ver y editar su propio perfil.
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

l flujo actual

Cuando el usuario hace login:

Se genera un JWT con su id, tenantId y roleId.

Cada petición al backend que use AuthGuard:

El guard extrae el token, lo valida y mete esos datos en req.user.

En tus controladores (ej. GrupoController):

Tomas req.user.tenantId y lo usas para asociar la creación de datos al tenant correct

Si te logueas con usuario A → req.user.tenantId = 1 → todo lo que crees va al tenant 1.

Si te logueas con usuario B → req.user.tenantId = 2 → todo lo que crees va al tenant 2.

No tienes que poner el tenant a mano ni en el frontend ni en el body de la petición.

El aislamiento multi-tenant ya se maneja automático según el usuario autenticado
