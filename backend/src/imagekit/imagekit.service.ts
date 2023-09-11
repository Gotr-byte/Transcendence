import {
  Injectable,
  InternalServerErrorException,
  UnsupportedMediaTypeException,
  UploadedFile,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import ImageKit from 'imagekit';
import { User } from '@prisma/client';

@Injectable()
export class ImagekitService {
  client: ImageKit;

  constructor(private readonly prisma: PrismaService) {
    this.client = new ImageKit({
      publicKey: process.env.PUBLIC_KEY_IMAGEKIT || '',
      privateKey: process.env.PRIVATE_KEY_IMAGEKIT || '',
      urlEndpoint: process.env.ENDPOINT_URL || '',
    });
  }

  async uploadAvatar(
    @UploadedFile() image: Express.Multer.File,
    userId: number,
  ): Promise<User> {
    await this.ensureFileIsImage(image.mimetype);
    const upload = await this.client
      .upload({
        file: image.buffer,
        fileName: Date.now() + image.originalname,
      })
      .catch((error) => {
        console.log(error);
        throw new InternalServerErrorException('Upload to Imagekit Failed');
      });

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: upload.url },
    });
    return user;
  }

  private async ensureFileIsImage(type: string): Promise<void> {
    const acceptedTypes = new Set([
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/bmp',
    ]);
    if (!acceptedTypes.has(type))
      throw new UnsupportedMediaTypeException(
        `${type} is not a supported image type`,
      );
  }
}
