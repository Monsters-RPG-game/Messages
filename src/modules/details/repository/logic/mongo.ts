import AbstractRepository from '../../../../tools/abstractions/repository.js';
import type * as enums from '../../../../enums/index.js';
import type DetailsModel from '../../model.js';
import type { IMessageDetails } from '../../types.js';

export default class DetailsRepository extends AbstractRepository<
  IMessageDetails,
  typeof DetailsModel,
  enums.EControllers.Details
> {}
