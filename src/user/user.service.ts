import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload, Tokens } from '../types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshTokenHash(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 7);
    await this.userRepo.update(
      { id: userId },
      { hashed_refresh_token: hashedRefreshToken },
    );
  }

  async signup(createUserDto: CreateUserDto, res: Response): Promise<any> {
    const existingUserByEmail = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUserByEmail) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует!',
      );
    }

    const existingUserByNumber = await this.userRepo.findOne({
      where: { number: createUserDto.number },
    });

    if (existingUserByNumber) {
      throw new BadRequestException(
        'Пользователь с таким номером телефона уже существует!',
      );
    }

    const hashed_password = await bcrypt.hash(createUserDto.password, 7);
    const { password, ...rest } = createUserDto;

    const newUser = await this.userRepo.save({
      ...rest,
      hashed_password,
    });

    const token = await this.getTokens(newUser.id, newUser.email);
    const hashed_refresh_token = await bcrypt.hash(token.refresh_token, 7);

    await this.userRepo.update({ id: newUser.id }, { hashed_refresh_token });

    res.cookie('refresh_token', token.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const { hashed_password: _, ...safeUser } = newUser;

    return {
      message: 'Пользователь зарегистрирован',
      user: safeUser,
      token,
    };
  }

  async signin(loginUserDto: LoginUserDto, res: Response): Promise<Tokens> {
    const { email, password } = loginUserDto;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден!');
    }

    const isMatchPass = await bcrypt.compare(password, user.hashed_password);
    if (!isMatchPass) {
      throw new UnauthorizedException('Неверный пароль!');
    }

    const tokens = await this.getTokens(user.id, user.email);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

    await this.userRepo.update(
      { id: user.id },
      {
        hashed_refresh_token: hashed_refresh_token,
      },
    );

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return tokens;
  }

  async signout(userId: number, res: Response): Promise<boolean> {
    const updatedUser = await this.userRepo.update(
      { id: userId },
      { hashed_refresh_token: null },
    );
    if (!updatedUser) throw new ForbiddenException('Доступ запрещён!');
    res.clearCookie('refresh_token');
    return true;
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
    res: Response,
  ): Promise<Tokens> {
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user || !user.hashed_refresh_token) {
      throw new ForbiddenException('Пользователь не найден!');
    }

    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );
    if (!tokenMatch) throw new ForbiddenException('Доступ запрещён!');

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return tokens;
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['videoCards'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const { id, email, number, monthlyProfit, videoCards } = user;

    return {
      id,
      email,
      number,
      monthlyProfit,
      videoCards,
    };
  }
}
