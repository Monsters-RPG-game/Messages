import mongoose from 'mongoose';
import { EMessageType } from '../../../../enums/db.js';
import * as errors from '../../../../errors/index.js';
import type SendChatMessageDto from './dto.js';
import type { IAbstractSubController } from '../../../../types/index.js';
import type { IDetailsRepository } from '../../../details/repository/types.js';
import type { IChatMessageRepository } from '../../repository/types.js';

export default class SendChatMessageController implements IAbstractSubController<void> {
  constructor(repo: IChatMessageRepository, detailsRepo: IDetailsRepository) {
    this.repo = repo;
    this.detailsRepo = detailsRepo;
  }

  private accessor repo: IChatMessageRepository;
  private accessor detailsRepo: IDetailsRepository;

  async execute(data: SendChatMessageDto, userId: string): Promise<void> {
    const { receiver, body, sender } = data;

    if (receiver === userId) throw new errors.ActionNotAllowed();

    let convId = new mongoose.Types.ObjectId().toString();
    const chatExist = await this.repo.getOne(sender, receiver);
    if (chatExist) convId = chatExist.chatId;

    const id = await this.detailsRepo.add({ message: body });
    await this.repo.add({
      ...data,
      body: id.toString(),
      owner: sender,
      type: EMessageType.Chat,
      chatId: convId,
    });
  }
}
