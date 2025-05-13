import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { ITokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user: User = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  public getCookieWithJwtAccessToken(user: User) {
    const payload: ITokenPayload = { email: user.email, sub: user.id };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });

    const cookie = `${this.configService.get(
      'JWT_ACCESS_COOKIE_NAME',
    )}=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    )}`;

    return cookie;
  }

  public getCookieWithJwtRefreshToken(user: User) {
    const payload: ITokenPayload = { email: user.email, sub: user.id };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    const cookie = `${this.configService.get(
      'JWT_REFRESH_COOKIE_NAME',
    )}=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    )}`;

    return {
      cookie,
      token,
    };
  }

  async login(user: User) {
    const accessTokenCookie = this.getCookieWithJwtAccessToken(user);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.getCookieWithJwtRefreshToken(user);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      user,
      accessTokenCookie,
      refreshTokenCookie,
    };
  }

  public getCookiesForLogOut() {
    return [
      `${this.configService.get(
        'JWT_ACCESS_COOKIE_NAME',
      )}=; HttpOnly; Path=/; Max-Age=0`,
      `${this.configService.get(
        'JWT_REFRESH_COOKIE_NAME',
      )}=; HttpOnly; Path=/; Max-Age=0`,
    ];
  }
}
