import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import fakeData from '../../../__tests__/utils/fakeData.json';
import { EFakeData } from '../../../__tests__/utils/fakeFactory/enums';
import FakeFactory from '../../../__tests__/utils/fakeFactory/src';
import Log from '../logger/log';
import type { IFakeState } from '../../../__tests__/utils/fakeFactory/types/data';
import type { IMessageEntity } from '../../modules/messages/entity';
import type { IMessageDetailsEntity } from '../../modules/messagesDetails/entity';

export default class Mock {
  private readonly _fakeFactory: FakeFactory | undefined = undefined;

  constructor() {
    this._fakeFactory = new FakeFactory();
  }

  private get fakeFactory(): FakeFactory {
    return this._fakeFactory!;
  }

  async init(): Promise<void> {
    const server = await MongoMemoryServer.create();
    await mongoose.connect(server.getUri());

    await this.fulfillDatabase();
    Log.log('Mongo', 'Started mock server');
  }

  private async fulfillDatabase(): Promise<void> {
    const messages = fakeData.messages as IMessageEntity[];
    const details = fakeData.details as IMessageDetailsEntity[];
    const chats = fakeData.chatMessages as IMessageEntity[];

    await this.fillData(EFakeData.MessageDetails, details);
    await this.fillData(EFakeData.Chat, chats);
    await this.fillData(EFakeData.Messages, messages);
  }

  private async fillData<T extends EFakeData>(type: T, params: IFakeState[T][]): Promise<void> {
    const target = this.fakeFactory[type];

    await Promise.all(
      params.map(async (p) => {
        for (const m of Object.getOwnPropertyNames(Object.getPrototypeOf(target))) {
          if (m === 'constructor' || m === 'create' || m === 'fillState' || typeof target[m] !== 'function') continue;

          const method = target[m] as (arg: unknown) => void;
          method.call(target, p[m]);
        }
        await target.create();
      }),
    );
  }
}
