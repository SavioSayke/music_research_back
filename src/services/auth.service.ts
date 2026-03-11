import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwt from 'jsonwebtoken';

export interface AdminTokenPayload {
  sub: string;
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret =
      process.env.JWT_SECRET || process.env.ADMIN_TOKEN || 'dev-secret';
  }

  validateCredentials(username: string, password: string) {
    const cfgUser = process.env.ADMIN_USERNAME || 'admin';
    const cfgPass =
      process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH || 'admin';
    if (username === cfgUser && password === cfgPass) return true;
    return false;
  }

  createToken(subject = 'admin', expiresIn = '8h') {
    const payload: AdminTokenPayload = { sub: subject, role: 'admin' };
    return (jwt as any).sign(payload as any, this.jwtSecret as any, {
      expiresIn,
    });
  }

  verifyToken(token: string): AdminTokenPayload {
    try {
      const decoded = (jwt as any).verify(
        token,
        this.jwtSecret as any,
      ) as AdminTokenPayload;
      return decoded;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
