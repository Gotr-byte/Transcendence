import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Channel, ChannelMemberRoles, ChannelTypes } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedService } from '../shared/shared.service';
import { CreateChannelDto, UpdateChannelDto } from './dto';
import { ChannelDto, ShowChannelDto } from '../shared/dto';
import * as argon from 'argon2';

@Injectable()
export class ManagementService {
  constructor(
    private prisma: PrismaService,
    private readonly sharedService: SharedService,
  ) {}

  async createChannel(
    creatorId: number,
    createChannelDto: CreateChannelDto,
  ): Promise<ShowChannelDto> {
    if (createChannelDto.channelType === ChannelTypes.PROTECTED) {
      this.validatePasswordPresence(createChannelDto.password);
      createChannelDto.password = await this.hashPassword(
        createChannelDto.password,
      );
    }

    const channel = await this.prisma.channel.create({
      data: { creatorId, ...createChannelDto },
    });

    await this.addAdminUser(creatorId, channel.id);

    return ShowChannelDto.from(channel, 1);
  }

  async editChannel(
    channelId: number,
    userId: number,
    editChannelDto: UpdateChannelDto,
  ): Promise<ChannelDto> {
    const channel = await this.verifyCreator(channelId, userId);

    const isChannelProtected = await this.isChannelProtected(
      channel,
      editChannelDto,
    );

    if (isChannelProtected) {
      await this.validatePasswordPresence(editChannelDto.password);
      editChannelDto.password = await this.hashPassword(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        editChannelDto.password!,
      );
    }

    const updatedChannel = await this.updateChannel(channelId, editChannelDto);

    return ChannelDto.from(updatedChannel);
  }

  async deleteChannel(channelId: number, userId: number): Promise<void> {
    await this.verifyCreator(channelId, userId);
    await this.sharedService.deleteAllChannelRestrictions(channelId);
    await this.sharedService.deleteAllChannelMessages(channelId);
    await this.kickAllUsers(channelId);
    await this.sharedService.removeChannel(channelId);
  }

  private async validatePasswordPresence(
    password: string | undefined,
  ): Promise<void> {
    if (!password)
      throw new BadRequestException(
        'Password is missing for protected channel',
      );
  }

  private async hashPassword(password: string): Promise<string> {
    return await argon.hash(password);
  }

  private async addAdminUser(userId: number, channelId: number): Promise<void> {
    await this.sharedService.addUser({
      channelId,
      userId,
      role: ChannelMemberRoles.ADMIN,
    });
  }

  private async verifyCreator(
    channelId: number,
    userId: number,
  ): Promise<Channel> {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId, creatorId: userId },
    });
    if (!channel)
      throw new UnauthorizedException(
        `User with id '${userId}' is not creator of channel (ID:${channelId})`,
      );
    return channel;
  }

  private async isChannelProtected(
    channel: Channel,
    channelProps: UpdateChannelDto | CreateChannelDto,
  ): Promise<boolean> {
    const isProtected =
      channelProps?.channelType === ChannelTypes.PROTECTED ||
      (!channelProps?.channelType &&
        channel.channelType === ChannelTypes.PROTECTED);
    return isProtected;
  }

  private async updateChannel(
    channelId: number,
    data: UpdateChannelDto,
  ): Promise<Channel> {
    const channel = await this.prisma.channel.update({
      where: { id: channelId },
      data,
    });
    return channel;
  }

  private async kickAllUsers(channelId: number): Promise<void> {
    await this.prisma.channelMember.deleteMany({ where: { channelId } });
  }
}
