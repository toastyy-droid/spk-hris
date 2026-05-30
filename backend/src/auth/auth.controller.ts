import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with username/password' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user + employee' })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@CurrentUser('sub') userId: number) {
    return this.auth.getProfile(userId);
  }
}
