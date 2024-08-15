import mongoose from 'mongoose';
import Message from './model';
import { EDbCollections, EMessageTargets } from '../../enums';
import RoosterFactory from '../../tools/abstract/rooster';
import type {
  IFullMessageEntity,
  IGetMessageEntity,
  IGetOneMessageEntity,
  IMessageEntity,
  IUnreadMessageEntity,
} from './entity';
import type { EModules } from '../../tools/abstract/enums';
import type * as types from '../../types';

export default class Rooster extends RoosterFactory<types.IMessage, typeof Message, EModules.Messages> {
  async getByOwner(owner: string, page: number): Promise<IGetMessageEntity[]> {
    return Message.find({ $or: [{ sender: owner }, { receiver: owner }] })
      .select({
        sender: true,
        receiver: true,
        type: true,
        chatId: true,
      })
      .limit(100)
      .sort({ _id: -1 })
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean();
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
      .lean();
  }
  async getOneByChatId(chatId: string, receiver: string): Promise<IGetOneMessageEntity | null> {
    return this.model
      .findOne({ chatId, receiver })
      .select({
        read: true,
        chatId: true,
        sender: true,
      })
      .lean();
  }
  async getUnread(owner: string, page: number): Promise<IUnreadMessageEntity[]> {
    return this.model
      .find({
        $or: [{ sender: owner }, { receiver: owner }],
        read: false,
        type: EMessageTargets.Messages,
      })
      .select({ chatId: true, sender: true, receiver: true, createdAt: true })
      .sort({ createdAt: 1 })
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean();
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
            from: EDbCollections.MessageDetails,
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
            date: true,
            message: { $arrayElemAt: ['$details.message', 0] },
          },
        },
      ])
      .limit(100)
      .sort({ _id: 1 })
      .skip((page <= 0 ? 0 : page - 1) * 100)) as IFullMessageEntity[];

    return !data || data.length === 0 ? [] : data;
  }

  async update(
    chatId: string,
    sender: string,
    data: types.IObjectUpdate<IMessageEntity, keyof IMessageEntity>,
  ): Promise<void> {
    await this.model.updateMany({ chatId, sender }, { $set: { ...data } }, { upsert: true });
  }
}
