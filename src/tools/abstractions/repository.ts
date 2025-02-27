import type { EControllers } from '../../enums/index.js';
import type * as types from '../../types/index.js';
import type { Document, FilterQuery, Model } from 'mongoose';

export default abstract class RepositoryFactory<T extends Document, U extends Model<T>, Z extends EControllers>
  implements types.IAbstractRepository<Z>
{
  private readonly _model: U;

  constructor(model: U) {
    this._model = model;
  }

  get model(): U {
    return this._model;
  }

  async getAll(page: number): Promise<types.IRepositoryGetInData[Z][]> {
    return this.model
      .find({})
      .limit(100)
      .skip((page <= 0 ? 0 : page - 1) * 100)
      .lean<types.IRepositoryGetInData[Z][]>();
  }

  async getIn(target: string, value: string[]): Promise<types.IRepositoryGetInData[Z][]> {
    const query: FilterQuery<Record<string, unknown>> = {};
    query[target] = {
      $in: value,
    };
    return this.model.find(query).lean<types.IRepositoryGetInData[Z][]>();
  }

  async add(data: types.IRepositoryAddData[Z]): Promise<string> {
    const newElement = new this.model(data);
    const callback = await newElement.save();
    return callback._id as string;
  }

  async count(filter: FilterQuery<Record<string, unknown>>): Promise<number> {
    return this.model.countDocuments(filter);
  }

  async get(_id: unknown): Promise<types.IRepositoryGetData[Z] | null> {
    return (await this.model.findOne({ _id } as FilterQuery<Record<string, unknown>>).lean()) as
      | types.IRepositoryGetData[Z]
      | null;
  }
}
