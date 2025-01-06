import type { ISendMessageDto } from './subModules/send/types.js';
import type { EMessageTargets } from '../../enums/index.js';
import type mongoose from 'mongoose';

export interface IMessageEntity extends ISendMessageDto {
  _id: mongoose.Types.ObjectId | string;
  read: boolean;
  type: EMessageTargets;
  chatId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IFullMessageEntity {
  sender: string;
  receiver: string;
  read: boolean;
  chatId: string;
  message: string;
}

export interface IGetMessageEntity {
  sender: string;
  receiver: string;
  type: EMessageTargets;
  chatId: string;
}

export interface IUnreadMessageEntity {
  chatId: string;
  sender: string;
  receiver: string;
  createdAt: string;
}

export interface IGetOneMessageEntity {
  read: boolean;
  chatId: string;
  sender: string;
}

export interface IUnreadMessageListEntity {
  lastMessage: number;
  unread: number;
  chatId: string;
  participants: string[];
}

export interface IPreparedMessagesBody {
  sender: string;
  receiver: string;
  messages: number;
}

export interface IPreparedMessages {
  type: EMessageTargets;
  messages: Record<string, IPreparedMessagesBody>;
}
