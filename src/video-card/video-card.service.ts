import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoCard } from './entities/video-card.entity';
import { Repository } from 'typeorm';
import { VideoCardType } from '../common/constants/video-cards';
import { User } from '../user/entities/user.entity';

@Injectable()
export class VideoCardService {
  constructor(
    @InjectRepository(VideoCard)
    private videoCardRepo: Repository<VideoCard>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async buyCard(userId: number, type: VideoCardType) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const card = this.videoCardRepo.create({
      type,
    });

    await this.videoCardRepo.save(card);

    return {
      message: 'Карта успешно куплена',
      card,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
