import {
  Body,
  Controller,
  /*ParseIntPipe,*/ Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
// import { Request } from 'express';

//Focuses on connect

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  // @Req gives all the request
  signup(@Body() dto: AuthDto) {
    //the barren pattern dto: AuthDto instead of saying any
    // signup(
    //   @Body('email') email: string,
    //   @Body('password', ParseIntPipe) password: string, //parseIntPipe causes error if password isn't num
    // ) {
    // console.log(req.body);
    // console.log({
    //   email,
    //   typeOfEmail: typeof email,
    //   password,
    //   typeOfPassword: typeof password,
    // });
    // console.log({
    //   dto,
    // });
    return this.authService.signUp(dto);
  }
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }
}
