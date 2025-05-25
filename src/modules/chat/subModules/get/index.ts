import type GetChatMessageDto from './dto.js';
import type { IAbstractSubController } from '../../../../types/index.js';
import type { IDetailsRepository } from '../../../details/repository/types.js';
import type { IGetMessageEntity, IPreparedMessages, IPreparedMessagesBody } from '../../../messages/entity.js';
import type { IFullChatMessageEntity } from '../../entity.js';
import type { IChatMessageRepository } from '../../repository/types.js';

export default class GetChatMessageController
  implements IAbstractSubController<Record<string, IPreparedMessagesBody> | IFullChatMessageEntity[]>
{
  constructor(repo: IChatMessageRepository, detailsRepo: IDetailsRepository) {
    this.repo = repo;
    this.detailsRepo = detailsRepo;
  }

  private accessor repo: IChatMessageRepository;
  private accessor detailsRepo: IDetailsRepository;

  async execute(
    data: GetChatMessageDto,
    userId: string,
  ): Promise<Record<string, IPreparedMessagesBody> | IFullChatMessageEntity[]> {
    const { page, target } = data;

    if (target) return this.repo.getWithDetails(target, page);

    const messages = await this.repo.getByOwner(userId, page);
    if (!messages || messages.length === 0) return {};
    return this.formGetMessages(messages);
  }

  private formGetMessages(data: IGetMessageEntity[]): Record<string, IPreparedMessagesBody> {
    const prepared: IPreparedMessages = {
      type: data[0]!.type,
      messages: {},
    };

    data.forEach((d) => {
      prepared.messages[d.chatId] === undefined
        ? (prepared.messages[d.chatId] = { messages: 0, receiver: d.receiver, sender: d.sender })
        : null;

      prepared.messages[d.chatId]!.messages++;
    });

    return prepared.messages;
  }
}
