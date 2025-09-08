import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwAuthGuard extends AuthGuard('jwt') implements CanActivate {}
