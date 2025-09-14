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
