import type { IFullMessageEntity } from '../../messages/entity.js';
import type {
  IGetOneChatMessageEntity,
  IFullChatMessageEntity,
  IChatMessageEntity,
  IUnreadChatMessageEntity,
  INewMessage,
} from '../entity.js';
import type { FilterQuery } from 'mongoose';

export interface IChatMessageRepository {
  getByOwner(owner: string, page: number): Promise<IChatMessageEntity[]>;
  getOne(sender: string, receiver: string): Promise<{ chatId: string } | null>;
  getOneByChatId(chatId: string, receiver: string): Promise<IGetOneChatMessageEntity | null>;
  getUnread(owner: string, page: number): Promise<IUnreadChatMessageEntity[]>;
  getWithDetails(owner: string, page: number): Promise<IFullChatMessageEntity[]>;
  update(chatId: string, sender: string, data: Partial<IChatMessageEntity>): Promise<void>;
  getAll(page: number): Promise<IFullMessageEntity[]>;
  add(data: INewMessage): Promise<string>;
  count(filter: FilterQuery<Record<string, unknown>>): Promise<number>;
  getIn(target: string, value: string[]): Promise<IFullMessageEntity[]>;
  get(_id: unknown): Promise<IChatMessageEntity | null>;
}
