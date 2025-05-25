import mongoose from 'mongoose';
import { EMessageType } from '../../../../enums/db.js';
import * as errors from '../../../../errors/index.js';
import type SendMessageDto from './dto.js';
import type { IAbstractSubController } from '../../../../types/index.js';
import type { IDetailsRepository } from '../../../details/repository/types.js';
import type { IMessagesRepository } from '../../repository/types.js';

export default class SendMessageController implements IAbstractSubController<void> {
  constructor(repo: IMessagesRepository, details: IDetailsRepository) {
    this.repo = repo;
    this.details = details;
  }

  private accessor repo: IMessagesRepository;
  private accessor details: IDetailsRepository;

  async execute(data: SendMessageDto, userId: string): Promise<void> {
    if (data.receiver === userId) throw new errors.ActionNotAllowed();
    const { body, sender, receiver } = data;

    let convId = new mongoose.Types.ObjectId().toString();
    const chatExist = await this.repo.getOne(sender, receiver);
    if (chatExist) convId = chatExist.chatId;

    const id = await this.details.add({ message: body });
    await this.repo.add({
      ...data,
      body: id.toString(),
      owner: sender,
      type: EMessageType.Message,
      chatId: convId,
    });
  }
}
