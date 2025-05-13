import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(@Body() loginDto: LoginDto, @Req() req) {
    const { user, accessTokenCookie, refreshTokenCookie } =
      await this.authService.login(req.user);

    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return user;
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    return await this.usersService.create(registerDto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() request) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user,
    );

    request.res.setHeader('Set-Cookie', [accessTokenCookie]);
    return request.user;
  }

  @Post('logout')
  @Public()
  @HttpCode(200)
  logOut(@Req() req) {
    req.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }
}
