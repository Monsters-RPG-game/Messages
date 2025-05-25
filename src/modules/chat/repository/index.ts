import Log from 'simpl-loggar';
import MongoChatRepository from './logic/mongo.js';
import { NoRepositoryControllerSpecified } from '../../../errors/index.js';
import getConfig from '../../../tools/configLoader.js';
import Chat from '../model.js';
import type { IFullMessageEntity } from '../../messages/entity.js';
import type {
  IChatMessageEntity,
  IFullChatMessageEntity,
  IGetOneChatMessageEntity,
  INewMessage,
  IUnreadChatMessageEntity,
} from '../entity.js';
import type { IChatMessageRepository } from './types.js';
import type { FilterQuery } from 'mongoose';

class ChatRepository implements IChatMessageRepository {
  constructor(repository: IChatMessageRepository) {
    this.repository = repository;
  }

  private accessor repository: IChatMessageRepository;

  async get(id: unknown): Promise<IChatMessageEntity | null> {
    return this.repository.get(id);
  }

  async getByOwner(owner: string, page: number): Promise<IChatMessageEntity[]> {
    return this.repository.getByOwner(owner, page);
  }

  async getOne(sender: string, receiver: string): Promise<{ chatId: string } | null> {
    return this.repository.getOne(sender, receiver);
  }

  async getOneByChatId(chatId: string, receiver: string): Promise<IGetOneChatMessageEntity | null> {
    return this.repository.getOneByChatId(chatId, receiver);
  }

  async getUnread(owner: string, page: number): Promise<IUnreadChatMessageEntity[]> {
    return this.repository.getUnread(owner, page);
  }

  async getWithDetails(owner: string, page: number): Promise<IFullChatMessageEntity[]> {
    return this.repository.getWithDetails(owner, page);
  }

  async update(chatId: string, sender: string, data: Partial<IChatMessageEntity>): Promise<void> {
    return this.repository.update(chatId, sender, data);
  }

  async getAll(page: number): Promise<IFullMessageEntity[]> {
    return this.repository.getAll(page);
  }

  async add(data: INewMessage): Promise<string> {
    return this.repository.add(data);
  }

  async count(filter: FilterQuery<Record<string, unknown>>): Promise<number> {
    return this.repository.count(filter);
  }

  async getIn(target: string, value: string[]): Promise<IFullMessageEntity[]> {
    return this.repository.getIn(target, value);
  }
}

export default class ChatFacade {
  static createInstance(): IChatMessageRepository {
    const repositoryTarget = getConfig().repository;

    switch (repositoryTarget) {
      case 'mongo':
        ChatFacade.instance = new ChatRepository(new MongoChatRepository(Chat));
        return ChatFacade.instance;
      default:
        Log.error('No repository controller specified. Please specify type of controller in config files');
        throw new NoRepositoryControllerSpecified();
    }
  }

  private static accessor instance: IChatMessageRepository | undefined = undefined;
}
