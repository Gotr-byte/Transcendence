import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImgurClient } from 'imgur';
import imgur from 'imgur'

const client = new ImgurClient({ clientId: process.env.APP_ID_IMGUR });

@Injectable()
export class ImgurService {
  async uploadPicture(image: Express.Multer.File, userId: number) {
	imgur.uploadFile()
    const imgurResponse = await 
  }
}
