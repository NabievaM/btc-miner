import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { VideoCardType } from '../../common/constants/video-cards';

@Entity()
export class VideoCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: VideoCardType })
  type: VideoCardType;

  @ManyToOne(() => User, (user) => user.videoCards, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  purchasedAt: Date;
}
