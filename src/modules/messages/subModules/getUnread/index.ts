import type GetMessageDto from './dto.js';
import type { IAbstractSubController } from '../../../../types/index.js';
import type { IUnreadMessageEntity, IUnreadMessageListEntity } from '../../entity.js';
import type { IMessagesRepository } from '../../repository/types.js';

export default class GetUnreadMessageController implements IAbstractSubController<IUnreadMessageListEntity[]> {
  constructor(repo: IMessagesRepository) {
    this.repo = repo;
  }

  private accessor repo: IMessagesRepository;

  async execute(data: GetMessageDto, userId: string): Promise<IUnreadMessageListEntity[]> {
    const { page } = data;

    const messages = await this.repo.getUnread(userId, page);
    return this.formUnreadMessages(messages, userId);
  }

  private formUnreadMessages(data: IUnreadMessageEntity[], user: string): IUnreadMessageListEntity[] {
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
