import * as errors from '../../../../errors/index.js';
import type ReadMessageDto from './dto.js';
import type { IAbstractSubController } from '../../../../types/index.js';
import type { IMessagesRepository } from '../../repository/types.js';

export default class ReadMessageController implements IAbstractSubController<void> {
  constructor(repo: IMessagesRepository) {
    this.repo = repo;
  }

  private accessor repo: IMessagesRepository;

  async execute(data: ReadMessageDto): Promise<void> {
    const { chatId, user } = data;

    const unread = await this.repo.getOneByChatId(chatId, user);
    if (!unread) throw new errors.MissingMessageError();
    if (unread.read) throw new errors.MessageAlreadyRead();

    await this.repo.update(unread.chatId, unread.sender, { read: true });
  }
}
