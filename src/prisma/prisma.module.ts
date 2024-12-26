import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// logic that connects to the db
@Global() // not to import it every time we need it in another module.
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Export it so that it can be accessed through prisma Module
})
export class PrismaModule {}
