import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { VideoCardService } from './video-card.service';
import { BuyVideoCardDto } from './dto/create-video-card.dto';
import { ApiBearerAuth, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { RequestWithUser } from '../common/types/express-request-with-user';

@Controller('store')
export class VideoCardController {
  constructor(private readonly videoCardService: VideoCardService) {}

  @Post('buy')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Купить видеокарту' })
  @ApiBody({ type: BuyVideoCardDto })
  buy(@Req() req: RequestWithUser, @Body() dto: BuyVideoCardDto) {
    return this.videoCardService.buyCard(req.user.sub, dto.type);
  }
}
