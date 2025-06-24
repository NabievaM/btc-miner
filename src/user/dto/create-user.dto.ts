import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'mukhlis@gmail.com',
    description: 'Электронная почта пользователя',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassw0rd!',
    description: 'Пароль пользователя (должен быть сложным)',
  })
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Номер телефона пользователя',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  number: string;
}
