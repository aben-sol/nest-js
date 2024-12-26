import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  //logic to run before our e2e test
  clearDb() {
    return this.$transaction([
      this.bookMark.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
