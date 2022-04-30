import { IAuth } from './../../interfaces/auth.interface';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import 'dotenv/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IAuth) {
    /*if (!this.validatePermissions(payload.role, req.url, req.method))
      throw new UnauthorizedException();*/

    return {
      id: payload.id,
      email: payload.email,
    };
  }

  private validatePermissions(
    roles: string,
    endpoint: string,
    method: string,
  ): boolean {
    const endpointName = endpoint.split('/')[1];
    const methodName = this.convertMethodToPermission(method.toUpperCase());

    const permissions = roles.split(';');

    return permissions.some(
      (permission) => permission === `${endpointName}:${methodName}`,
    );
  }

  private convertMethodToPermission(method: string): string {
    switch (method) {
      case 'GET':
        return 'read';
      case 'POST':
        return 'write';
      case 'PUT':
        return 'update';
      case 'DELETE':
        return 'delete';
    }
  }
}
