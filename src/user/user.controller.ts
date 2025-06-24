import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Tokens } from '../types';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { RefreshTokenGuard } from '../common/guards';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('Пользователи')
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    type: User,
    description: 'Пользователь успешно зарегистрирован',
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.userService.signup(createUserDto, res);
  }

  @Public()
  @ApiOperation({ summary: 'Вход пользователя в систему' })
  @ApiResponse({ status: 200, type: User, description: 'Успешный вход' })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.userService.signin(loginUserDto, res);
  }

  @ApiOperation({ summary: 'Выход пользователя из системы' })
  @ApiResponse({ status: 200, description: 'Выход выполнен успешно' })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  signout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    return this.userService.signout(userId, res);
  }

  @Public()
  @ApiOperation({ summary: 'Обновление токенов пользователя (refresh token)' })
  @ApiResponse({ status: 200, description: 'Токены успешно обновлены' })
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    return this.userService.refreshTokens(userId, refreshToken, res);
  }
}
