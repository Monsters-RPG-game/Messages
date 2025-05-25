import MessagesRepository from './repository/index.js';
import * as enums from '../../enums/index.js';
import GetMessagesController from './subModules/get/index.js';
import GetUnreadMessagesController from './subModules/getUnread/index.js';
import ReadMessageController from './subModules/read/index.js';
import SendMessageController from './subModules/send/index.js';
import AbstractController from '../../tools/abstractions/controller.js';
import DetailsRepository from '../details/repository/index.js';

export default class MessagesController extends AbstractController<enums.EControllers.Messages> {
  /**
   * Register messages controllers.
   * @returns Void.
   */
  protected init(): void {
    const messagesRepo = MessagesRepository.createInstance();
    const detailsRepo = DetailsRepository.createInstance();

    this.register(enums.EMessagesActions.Get, new GetMessagesController(messagesRepo));
    this.register(enums.EMessagesActions.Send, new SendMessageController(messagesRepo, detailsRepo));
    this.register(enums.EMessagesActions.GetUnread, new GetUnreadMessagesController(messagesRepo));
    this.register(enums.EMessagesActions.Read, new ReadMessageController(messagesRepo));
  }
}
