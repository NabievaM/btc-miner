import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VideoCardType } from '../../common/constants/video-cards';

export class BuyVideoCardDto {
  @ApiProperty({ enum: VideoCardType, description: 'Тип видеокарты' })
  @IsEnum(VideoCardType)
  type: VideoCardType;
}
