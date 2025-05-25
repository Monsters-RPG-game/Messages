import type GetMessageDto from './dto.js';
import type { IAbstractSubController } from '../../../../types/index.js';
import type { IFullMessageEntity, IGetMessageEntity, IPreparedMessages, IPreparedMessagesBody } from '../../entity.js';
import type { IMessagesRepository } from 'modules/messages/repository/types.js';

export default class GetMessageController
  implements IAbstractSubController<Record<string, IPreparedMessagesBody> | IFullMessageEntity[]>
{
  constructor(repo: IMessagesRepository) {
    this.repo = repo;
  }

  private accessor repo: IMessagesRepository;

  async execute(
    data: GetMessageDto,
    userId: string,
  ): Promise<Record<string, IPreparedMessagesBody> | IFullMessageEntity[]> {
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
