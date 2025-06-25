import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VideoCardType } from '../../common/constants/video-cards';

export class BuyVideoCardDto {
  @ApiProperty({
    enum: VideoCardType,
    enumName: 'VideoCardType',
    description: 'Тип видеокарты: GTX_1660, RTX_3060, RTX_3080, RTX_4090',
    example: VideoCardType.RTX_3060,
  })
  @IsEnum(VideoCardType)
  type: VideoCardType;
}
