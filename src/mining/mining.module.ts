import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { MiningService } from './mining.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [MiningService],
})
export class MiningModule {}
