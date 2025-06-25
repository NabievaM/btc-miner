import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoCardService } from './video-card.service';
import { VideoCardController } from './video-card.controller';
import { VideoCard } from './entities/video-card.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VideoCard, User])],
  controllers: [VideoCardController],
  providers: [VideoCardService],
})
export class VideoCardModule {}
