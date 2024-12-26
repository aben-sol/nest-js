import {
  Body,
  Controller,
  Get,
  Patch,
  // Req,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
// import { AuthGuard } from '@nestjs/passport';
// import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UsersService } from './users.service';
import { AuthDto } from 'src/auth/dto';

// Lets guard this route
// @UseGuards(AuthGuard('jwt')) // using a string' jwt causes error so
@UseGuards(JwtGuard) // in auth/guard
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
  ) {}
  //'GET/users/me'
  @Get('me')
  // getMe(@Req() req: Request) { // creates an error so we created the custom decorator
  getMe(@GetUser() user: User) {
    // return req.user;
    return user;
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    console.log('UserId:', userId);
    return this.userService.editUser(userId, dto);
  }
}
