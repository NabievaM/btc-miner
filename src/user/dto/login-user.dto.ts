import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    example: 'mukhlis@gmail.com',
    description: 'Электронная почта пользователя',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'StrongPassw0rd!',
    description: 'Пароль пользователя',
  })
  @IsNotEmpty()
  password: string;
}
