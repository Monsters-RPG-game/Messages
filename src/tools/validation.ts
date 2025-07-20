import RawValidation from '@monsters/validator';
import mongoose from 'mongoose';
import * as errors from '../errors/index.js';

export default class Validation extends RawValidation {
  /**
   * Validate if element is typeof mongoose.ObjectId
   * Require param: string.
   */
  isObjectId(): this {
    const { v, name } = this;
    const value = v as string;

    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new errors.IncorrectArgTypeError(`${name} should be objectId`);
    }

    return this;
  }

  /**
   * Validate if element has children, which are typeof objectId
   * Require param: array of numbers.
   */
  isObjectIdArray(): this {
    const { v, name } = this;
    const value = v as string[];

    if (!Array.isArray(value)) throw new errors.IncorrectArgTypeError(`${name} should be array`);
    if (value.length === 0) return this;

    value.forEach((e) => {
      if (!mongoose.Types.ObjectId.isValid(e))
        throw new errors.IncorrectArgTypeError(`${name}.${e} should be objectId`);
    });

    return this;
  }
}
