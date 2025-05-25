import type { IMessageDetailsEntity } from '../entity.js';
import type { IAddMessageDetailsDto } from '../subModules/add/types.js';
import type { FilterQuery } from 'mongoose';

export interface IDetailsRepository {
  getAll(page: number): Promise<IMessageDetailsEntity[]>;
  add(data: IAddMessageDetailsDto): Promise<string>;
  count(filter: FilterQuery<Record<string, unknown>>): Promise<number>;
  getIn(target: string, value: string[]): Promise<IMessageDetailsEntity[]>;
  get(_id: unknown): Promise<IMessageDetailsEntity | null>;
}
