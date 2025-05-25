import * as errors from '../../../../errors/index.js';
import type ReadChatMessageDto from './dto.js';
import type { IAbstractSubController } from '../../../../types/index.js';
import type { IDetailsRepository } from '../../../details/repository/types.js';
import type { IChatMessageRepository } from '../../repository/types.js';

export default class ReadChatMessageController implements IAbstractSubController<void> {
  constructor(repo: IChatMessageRepository, detailsRepo: IDetailsRepository) {
    this.repo = repo;
    this.detailsRepo = detailsRepo;
  }

  private accessor repo: IChatMessageRepository;
  private accessor detailsRepo: IDetailsRepository;

  async execute(data: ReadChatMessageDto): Promise<void> {
    const { chatId, user } = data;

    const unread = await this.repo.getOneByChatId(chatId, user);
    if (!unread) throw new errors.MissingMessageError();
    if (unread.read) throw new errors.MessageAlreadyRead();

    await this.repo.update(unread.chatId, unread.sender, { read: true });
  }
}
