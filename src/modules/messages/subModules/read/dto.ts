import Validation from '../../../../tools/validation.js';
import type { IReadMessageDto } from './types.js';

export default class ReadMessageDto implements IReadMessageDto {
  chatId: string;
  user: string;

  constructor(data: IReadMessageDto) {
    this.chatId = data.chatId;
    this.user = data.user;

    this.validate();
  }

  private validate(): void {
    new Validation(this.chatId, 'chatId').isDefined().isString().isObjectId();
    new Validation(this.user, 'user').isDefined().isString().isObjectId();
  }
}
