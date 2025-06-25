import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCurrentUserId } from '../common/decorators';
import { AccessTokenGuard } from '../common/guards';
import { UserService } from './user.service';

@ApiTags('Профиль')
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Получить информацию о пользователе' })
  @Get()
  getProfile(@GetCurrentUserId() userId: number) {
    return this.userService.getProfile(userId);
  }
}
