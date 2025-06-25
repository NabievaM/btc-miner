import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { VideoCard } from '../../video-card/entities/video-card.entity';

@Entity('users')
export class User {
  @ApiProperty({
    example: 1,
    description: 'Уникальный идентификатор пользователя',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'mukhlis@gmail.com',
    description: 'Электронная почта пользователя',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: '$2b$10$abc123...',
    description: 'Хешированный пароль пользователя',
  })
  @Column()
  hashed_password: string;

  @ApiProperty({
    example: '+998901234567',
    description: 'Номер телефона пользователя',
  })
  @Column({ unique: true })
  number: string;

  @ApiProperty({
    example: '$2b$10$refreshTokenHash...',
    description: 'Хешированный refresh токен (может быть null)',
    required: false,
  })
  @Column({ nullable: true })
  hashed_refresh_token: string;

  @OneToMany(() => VideoCard, (card) => card.user)
  videoCards: VideoCard[];
}
