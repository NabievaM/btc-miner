import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { videoCardData } from '../common/constants/video-cards';

@Injectable()
export class MiningService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // @Cron('* * * * *')
  async handleMining() {
    const users = await this.userRepo.find({
      relations: ['videoCards'],
    });

    for (const user of users) {
      let totalProfit = 0;

      for (const card of user.videoCards) {
        const data = videoCardData[card.type];
        if (data) {
          totalProfit += data.hashRate * 24;
        }
      }

      if (totalProfit > 0) {
        user.monthlyProfit += totalProfit;
        await this.userRepo.save(user);
      }
    }
  }
}
