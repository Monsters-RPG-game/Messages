import TemplateFactory from './abstracts.js';
import type { EFakeData } from '../enums/index.js';
import Message from '../../../../src/modules/messages/model.js';
import type { IAbstractBody } from '../types/data.js';
import { IMessageEntity } from '../../../../src/modules/messages/entity.js';
import { EMessageType } from '../../../../src/enums/index.js';
import mongoose from 'mongoose';

export default class FakeMessage extends TemplateFactory<EFakeData.Messages> implements IAbstractBody<IMessageEntity> {
  constructor() {
    super(Message);
  }

  _id(id? : string | mongoose.Types.ObjectId): this {
    this.state._id = id;
    return this;
  }

  body(body?: string): this {
    this.state.body = body;
    return this;
  }

  receiver(receiver?: string): this {
    this.state.receiver = receiver;
    return this;
  }

  sender(sender?: string): this {
    this.state.sender = sender;
    return this;
  }

  read(read?: boolean): this {
    this.state.read = read;
    return this;
  }

  type(type?: EMessageType): this {
    this.state.type = type;
    return this;
  }

  chatId(id?: string): this {
    this.state.chatId = id;
    return this;
  }

  createdAt(createdAt?: string): this {
    this.state.createdAt = createdAt;
    return this;
  }

  updatedAt(updatedAt?: string): this {
    this.state.updatedAt = updatedAt;
    return this;
  }

  protected override fillState(): void {
    this.state = {
      _id: undefined,
      body: undefined,
      read: false,
      sender: undefined,
      receiver: undefined,
      type: EMessageType.Message,
      chatId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    };
  }
}
