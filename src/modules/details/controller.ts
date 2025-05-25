import DetailsRepository from './repository/index.js';
import AddMessageDetailsController from './subModules/add/index.js';
import * as enums from '../../enums/index.js';
import AbstractController from '../../tools/abstractions/controller.js';

export default class DetailsController extends AbstractController<enums.EControllers.Details> {
  /**
   * Register details controllers.
   * @returns Void.
   */
  protected init(): void {
    const repo = DetailsRepository.createInstance();

    this.register(enums.EMessageDetailsActions.Add, new AddMessageDetailsController(repo));
  }
}
