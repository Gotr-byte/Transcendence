import { Injectable } from '@nestjs/common';
import { ChannelMember } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SharedService {
	constructor(private prisma: PrismaService) {}

	
	async addUsers(channelMember: ChannelMember[]): Promise<number> {
		const batchPayload = await this.prisma.channelMember.createMany({
		  data: channelMember,
		});
		return batchPayload.count;
	  }

	async deleteAllChannelRestrictions(channelId: number): Promise<void> {
		await this.prisma.channelUserRestriction.deleteMany({
		  where: { restrictedChannelId: channelId },
		});
	  }
	
	  async deleteAllChannelMessages(channelId: number): Promise<void> {
		await this.prisma.message.deleteMany({ where: { channelId } });
	  }
	
	  async removeChannel(channelId: number): Promise<void> {
		await this.prisma.channel.delete({ where: { id: channelId } });
	  }

  async deleteUserFromChannel(
    userId: number,
    channelId: number,
  ): Promise<void> {
    await this.prisma.channelMember.delete({
      where: { userId_channelId: { userId, channelId } },
    });
  }
}
