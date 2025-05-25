import type {
  IFullMessageEntity,
  IGetMessageEntity,
  IGetOneMessageEntity,
  IMessageEntity,
  IUnreadMessageEntity,
} from '../entity.js';
import type { INewMessage } from 'modules/chat/entity.js';
import type { FilterQuery } from 'mongoose';

export interface IMessagesRepository {
  getByOwner(owner: string, page: number): Promise<IGetMessageEntity[]>;
  getOne(sender: string, receiver: string): Promise<{ chatId: string } | null>;
  getOneByChatId(chatId: string, receiver: string): Promise<IGetOneMessageEntity | null>;
  getUnread(owner: string, page: number): Promise<IUnreadMessageEntity[]>;
  getWithDetails(owner: string, page: number): Promise<IFullMessageEntity[]>;
  update(chatId: string, sender: string, data: Partial<IMessageEntity>): Promise<void>;
  getAll(page: number): Promise<IGetMessageEntity[]>;
  add(data: INewMessage): Promise<string>;
  count(filter: FilterQuery<Record<string, unknown>>): Promise<number>;
  getIn(target: string, value: string[]): Promise<IGetMessageEntity[]>;
  get(_id: unknown): Promise<IMessageEntity | null>;
}
