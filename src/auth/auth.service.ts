import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login(dto: AuthDto) {
    // find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    // no user by email throw error
    if (!user)
      throw new ForbiddenException(
        'Incorrect Credentials',
      );

    //compare password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    // password mismatch throw an error
    if (!pwMatches)
      throw new ForbiddenException(
        'Incorrect Credentials',
      );

    //return the user back
    // delete user.hash; //no use here since all is covered by the signToken
    // return user; // return token instead
    return this.signToken(user.id, user.email);
    // return 'Login Successfully';
  }
  async signUp(dto: AuthDto) {
    //we get validated email and password form controller
    //steps:
    //1. generate hash for password
    const hash = await argon.hash(dto.password);

    //2. save user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },

        // select: {    //tedious because everything selecting
        //   email: true,
        //   createdAt: true,
        //   id: true,
        // },
      });
      delete user.hash;

      //3. return saved user
      // return user; // same thing here no need for returning the user
      return this.signToken(user.id, user.email);
    } catch (error) {
      // all this is to avoid status code 500 since it doesn't tell us which error
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          //NOT UNIQUE
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '15m',
        secret, // not going to be published on github so we put it in env
      },
    );

    return { access_token: token };
  }
}
