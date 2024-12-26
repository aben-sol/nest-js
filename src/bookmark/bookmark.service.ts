import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  CreateBookmarkDto,
  EditBookmarkDto,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}
  getBookmarks(userId: number) {
    return this.prisma.bookMark.findMany({
      where: {
        userId,
      },
    });
  }

  getBookmarkById(
    userId: number,
    bookmarkId: number,
  ) {
    return this.prisma.bookMark.findFirst({
      where: {
        // userId,
        id: bookmarkId,
      },
    });
  }

  async createBookmark(
    userId: number,
    dto: CreateBookmarkDto,
  ) {
    const bookmark =
      await this.prisma.bookMark.create({
        data: {
          userId,
          ...dto,
        },
      });

    return bookmark;
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDto,
  ) {
    // get bookmark by id
    const bookmark =
      await this.prisma.bookMark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    //check if user owns the book mark
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException(
        'Access to resource denied',
      );
    }

    return this.prisma.bookMark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(
    userId: number,
    bookmarkId: number,
  ) {
    // get bookmark by id
    const bookmark =
      await this.prisma.bookMark.findUnique({
        where: {
          id: bookmarkId,
        },
      });

    //check if user owns the book mark
    if (!bookmark || bookmark.userId !== userId) {
      throw new ForbiddenException(
        'Access to resource denied',
      );
    }

    await this.prisma.bookMark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }
}
