import mongoose from 'mongoose';
import * as enums from '../../../../enums/index.js';
import AbstractRepository from '../../../../tools/abstractions/repository.js';
import type {
  IFullChatMessageEntity,
  IGetOneChatMessageEntity,
  IChatMessageEntity,
  IUnreadChatMessageEntity,
} from '../../entity.js';
import type ChatMessageModel from '../../model.js';
import type { IChatMessage } from '../../types.js';
import type { IChatMessageRepository } from '../types.js';

export default class ChatRepository
  extends AbstractRepository<IChatMessage, typeof ChatMessageModel, enums.EControllers.Chat>
  implements IChatMessageRepository
{
  async getByOwner(owner: string, page: number): Promise<IChatMessageEntity[]> {
    return this.model
      .find({ $or: [{ sender: owner }, { receiver: owner }] })
      .select({
        _id: false,
        sender: true,
        receiver: true,
        type: true,
        chatId: true,
      })
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .sort({ _id: -1 })
      .lean<IChatMessageEntity[]>();
  }

  /**
   * Get one message with selected sender and receiver. Currently used to validate if user ever had conversation.
   * @param sender
   * @param receiver
   */
  async getOne(sender: string, receiver: string): Promise<{ chatId: string } | null> {
    return this.model
      .findOne({
        $or: [
          { sender, receiver },
          { receiver: sender, sender: receiver },
        ],
      })
      .select({ chatId: true })
      .lean<{ chatId: string } | null>();
  }

  async getOneByChatId(chatId: string, receiver: string): Promise<IGetOneChatMessageEntity | null> {
    return this.model
      .findOne({ chatId, receiver })
      .select({
        read: true,
        chatId: true,
        sender: true,
      })
      .lean<IGetOneChatMessageEntity | null>();
  }

  async getUnread(owner: string, page: number): Promise<IUnreadChatMessageEntity[]> {
    return this.model
      .find({ $or: [{ sender: owner }, { receiver: owner }], read: false, type: enums.EMessageType.Chat })
      .select({ chatId: true, sender: true, receiver: true, createdAt: true })
      .sort({ createdAt: 1 })
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean<IUnreadChatMessageEntity[]>();
  }

  async getWithDetails(chatId: string, page: number): Promise<IFullChatMessageEntity[]> {
    const data = (await this.model
      .aggregate([
        {
          $match: { chatId: new mongoose.Types.ObjectId(chatId) },
        },
        {
          $lookup: {
            from: enums.EDbCollections.MessageDetails,
            localField: 'body',
            foreignField: '_id',
            as: 'details',
          },
        },
        {
          $project: {
            _id: 0,
            chatId: 1,
            sender: 1,
            receiver: 1,
            read: 1,
            message: { $arrayElemAt: ['$details.message', 0] },
          },
        },
      ])
      .limit(100)
      .sort({ _id: -1 })
      .skip((page <= 0 ? 0 : page - 1) * 100)) as IFullChatMessageEntity[];

    return !data || data.length === 0 ? [] : data;
  }

  async update(chatId: string, sender: string, data: Partial<IChatMessageEntity>): Promise<void> {
    await this.model.updateMany({ chatId, sender }, { $set: { ...data } }, { upsert: true });
  }
}
