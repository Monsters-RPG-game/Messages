import Log from 'simpl-loggar';
import MongoMessagesRepository from './logic/mongo.js';
import { NoRepositoryControllerSpecified } from '../../../errors/index.js';
import ConfigLoader from '../../../tools/config/index.js';
import Message from '../model.js';
import type {
  IFullMessageEntity,
  IGetMessageEntity,
  IGetOneMessageEntity,
  IMessageEntity,
  IUnreadMessageEntity,
} from '../entity.js';
import type { IMessagesRepository } from './types.js';
import type { INewMessage } from 'modules/chat/entity.js';
import type { FilterQuery } from 'mongoose';

class MessagesRepository implements IMessagesRepository {
  constructor(repository: IMessagesRepository) {
    this.repository = repository;
  }

  private accessor repository: IMessagesRepository;

  async getByOwner(owner: string, page: number): Promise<IGetMessageEntity[]> {
    return this.repository.getByOwner(owner, page);
  }

  async getAll(page: number): Promise<IGetMessageEntity[]> {
    return this.repository.getAll(page);
  }

  async add(data: INewMessage): Promise<string> {
    return this.repository.add(data);
  }

  async getIn(target: string, value: string[]): Promise<IGetMessageEntity[]> {
    return this.repository.getIn(target, value);
  }

  async get(id: unknown): Promise<IMessageEntity | null> {
    return this.repository.get(id);
  }

  async count(filter: FilterQuery<Record<string, unknown>>): Promise<number> {
    return this.repository.count(filter);
  }

  async getOne(sender: string, receiver: string): Promise<{ chatId: string } | null> {
    return this.repository.getOne(sender, receiver);
  }

  async getOneByChatId(chatId: string, receiver: string): Promise<IGetOneMessageEntity | null> {
    return this.repository.getOneByChatId(chatId, receiver);
  }

  async getUnread(owner: string, page: number): Promise<IUnreadMessageEntity[]> {
    return this.repository.getUnread(owner, page);
  }

  async getWithDetails(owner: string, page: number): Promise<IFullMessageEntity[]> {
    return this.repository.getWithDetails(owner, page);
  }

  async update(chatId: string, sender: string, data: Partial<IMessageEntity>): Promise<void> {
    return this.repository.update(chatId, sender, data);
  }
}

export default class MessagesFacade {
  static createInstance(): IMessagesRepository {
    const repositoryTarget = ConfigLoader.getConfig().repository;

    switch (repositoryTarget) {
      case 'mongo':
        MessagesFacade.instance = new MessagesRepository(new MongoMessagesRepository(Message));
        return MessagesFacade.instance;
      default:
        Log.error('No repository controller specified. Please specify type of controller in config files');
        throw new NoRepositoryControllerSpecified();
    }
  }

  private static accessor instance: IMessagesRepository | undefined = undefined;
}
