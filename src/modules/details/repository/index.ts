import Log from 'simpl-loggar';
import MongoDetailsRepository from './logic/mongo.js';
import { NoRepositoryControllerSpecified } from '../../../errors/index.js';
import ConfigLoader from '../../../tools/config/index.js';
import MessageDetails from '../model.js';
import type { IMessageDetailsEntity } from '../entity.js';
import type { IDetailsRepository } from './types.js';
import type { IAddMessageDetailsDto } from '../subModules/add/types.js';
import type { FilterQuery } from 'mongoose';

class DetailsRepository implements IDetailsRepository {
  constructor(repository: IDetailsRepository) {
    this.repository = repository;
  }

  private accessor repository: IDetailsRepository;

  async getAll(page: number): Promise<IMessageDetailsEntity[]> {
    return this.repository.getAll(page);
  }

  async add(data: IAddMessageDetailsDto): Promise<string> {
    return this.repository.add(data);
  }

  async count(filter: FilterQuery<Record<string, unknown>>): Promise<number> {
    return this.repository.count(filter);
  }

  async getIn(target: string, value: string[]): Promise<IMessageDetailsEntity[]> {
    return this.repository.getIn(target, value);
  }

  async get(id: unknown): Promise<IMessageDetailsEntity | null> {
    return this.repository.get(id);
  }
}

export default class DetailsFacade {
  static createInstance(): IDetailsRepository {
    const repositoryTarget = ConfigLoader.getConfig().repository;

    switch (repositoryTarget) {
      case 'mongo':
        DetailsFacade.instance = new DetailsRepository(new MongoDetailsRepository(MessageDetails));
        return DetailsFacade.instance;
      default:
        Log.error('No repository controller specified. Please specify type of controller in config files');
        throw new NoRepositoryControllerSpecified();
    }
  }

  private static accessor instance: IDetailsRepository | undefined = undefined;
}
