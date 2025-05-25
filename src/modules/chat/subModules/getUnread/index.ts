import type GetUnreadChatMessageDto from './dto.js';
import type { IAbstractSubController } from '../../../../types/index.js';
import type { IDetailsRepository } from '../../../details/repository/types.js';
import type { IUnreadMessageListEntity } from '../../../messages/entity.js';
import type { IUnreadChatMessageEntity } from '../../entity.js';
import type { IChatMessageRepository } from '../../repository/types.js';

export default class GetUnreadChatMessageController implements IAbstractSubController<IUnreadMessageListEntity[]> {
  constructor(repo: IChatMessageRepository, detailsRepo: IDetailsRepository) {
    this.repo = repo;
    this.detailsRepo = detailsRepo;
  }

  private accessor repo: IChatMessageRepository;
  private accessor detailsRepo: IDetailsRepository;

  async execute(data: GetUnreadChatMessageDto, userId: string): Promise<IUnreadMessageListEntity[]> {
    const { page } = data;

    const messages = await this.repo.getUnread(userId, page);
    return this.formUnreadMessages(messages, userId);
  }

  private formUnreadMessages(data: IUnreadChatMessageEntity[], user: string): IUnreadMessageListEntity[] {
    const prepared: Record<string, IUnreadMessageListEntity> = {};

    data.forEach((d) => {
      if (d.receiver.toString() !== user) return;

      prepared[d.chatId] === undefined
        ? (prepared[d.chatId] = {
            chatId: d.chatId,
            lastMessage: Date.parse(d.createdAt).valueOf(),
            participants: [d.receiver.toString(), d.sender.toString()],
            unread: 0,
          })
        : null;

      prepared[d.chatId]!.unread++;
      prepared[d.chatId]!.lastMessage = Date.parse(d.createdAt).valueOf();
    });

    return Object.values(prepared);
  }
}
