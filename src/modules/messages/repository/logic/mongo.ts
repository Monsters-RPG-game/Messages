import mongoose from 'mongoose';
import * as enums from '../../../../enums/index.js';
import AbstractRepository from '../../../../tools/abstractions/repository.js';
import type {
  IFullMessageEntity,
  IGetMessageEntity,
  IGetOneMessageEntity,
  IMessageEntity,
  IUnreadMessageEntity,
} from '../../entity.js';
import type MessageModel from '../../model.js';
import type { IMessage } from '../../types.js';
import type { IMessagesRepository } from '../types.js';

export default class MessagesRepository
  extends AbstractRepository<IMessage, typeof MessageModel, enums.EControllers.Messages>
  implements IMessagesRepository
{
  async getByOwner(owner: string, page: number): Promise<IGetMessageEntity[]> {
    return this.model
      .find({ $or: [{ sender: owner }, { receiver: owner }] })
      .select({
        sender: 1,
        receiver: 1,
        type: 1,
        chatId: 1,
      })
      .limit(100)
      .sort({ _id: -1 })
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean<IGetMessageEntity[]>();
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
      .select({ chatId: 1 })
      .lean<{ chatId: string } | null>();
  }

  async getOneByChatId(chatId: string, receiver: string): Promise<IGetOneMessageEntity | null> {
    return this.model
      .findOne({ chatId, receiver })
      .select({
        read: 1,
        chatId: 1,
        sender: 1,
      })
      .lean<IGetOneMessageEntity | null>();
  }

  async getUnread(owner: string, page: number): Promise<IUnreadMessageEntity[]> {
    return this.model
      .find({
        $or: [{ sender: owner }, { receiver: owner }],
        read: false,
        type: enums.EMessageType.Message,
      })
      .select({ chatId: 1, sender: 1, receiver: 1, createdAt: 1 })
      .sort({ createdAt: 1 })
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean<IUnreadMessageEntity[]>();
  }

  async getWithDetails(chatId: string, page: number): Promise<IFullMessageEntity[]> {
    const data = (await this.model
      .aggregate([
        {
          $match: { chatId: new mongoose.Types.ObjectId(chatId) },
        },
        {
          $addFields: { date: '$createdAt' },
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
            _id: 1,
            chatId: 1,
            sender: 1,
            receiver: 1,
            read: 1,
            date: 1,
            message: { $arrayElemAt: ['$details.message', 0] },
          },
        },
      ])
      .limit(100)
      .sort({ _id: 1 })
      .skip((page <= 0 ? 0 : page - 1) * 100)) as IFullMessageEntity[];

    return !data || data.length === 0 ? [] : data;
  }

  async update(chatId: string, sender: string, data: Partial<IMessageEntity>): Promise<void> {
    await this.model.updateMany({ chatId, sender }, { $set: { ...data } }, { upsert: true });
  }
}
