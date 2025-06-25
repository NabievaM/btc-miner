import { PartialType } from '@nestjs/swagger';
import { BuyVideoCardDto } from './create-video-card.dto';

export class UpdateVideoCardDto extends PartialType(BuyVideoCardDto) {}
