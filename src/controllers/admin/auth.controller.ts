import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from '../../services/auth.service';
import type { Response } from 'express';

@Controller('api/admin')
export class AdminAuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res() res: Response,
  ) {
    if (!body || !body.username || !body.password) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }

    const ok = this.auth.validateCredentials(body.username, body.password);
    if (!ok) throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    const token = this.auth.createToken(body.username);
    // set httpOnly cookie and return token in body
    res.cookie('admin_token', token, { httpOnly: true, sameSite: 'lax' });
    return res.json({ token });
  }
}
