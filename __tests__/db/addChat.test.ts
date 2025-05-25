import { afterEach, describe, expect, it } from '@jest/globals';
import Repository from '../../src/modules/chat/repository/index.js';
import fakeData from '../utils/fakeData.json';
import { IGetOneMessageEntity, IMessageEntity } from '../../src/modules/messages/entity.js';
import FakeFactory from '../utils/fakeFactory/src/index.js';
import { IFullError } from '../../src/types/index.js';
import { EMessageType } from '../../src/enums/index.js';
import { MongoIncorrectEnumError, MongoMissingError, MongoNotObjectIdError } from '../utils/errors/index.js';
import { INewMessage } from '../../src/modules/chat/entity.js';
import sleep from '../../src/utils/index.js';

describe('Chat - add', () => {
  const db = new FakeFactory();
  const fakeMessage = fakeData.messages[0] as IMessageEntity;
  const repo = Repository.createInstance();
  const newMessage: INewMessage = {
    owner: fakeMessage.sender,
    type: fakeMessage.type,
    chatId: fakeMessage.chatId,
    body: fakeMessage.body,
    receiver: fakeMessage.receiver,
    sender: fakeMessage.sender,
  };

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('Missing data', () => {
      it(`Missing receiver`, async () => {
        const target = new MongoMissingError('Chat', 'receiver');
        let error: IFullError | undefined = undefined

        const clone = structuredClone(newMessage);
        clone.receiver = undefined!;

        try {
          await repo.add(clone);
        } catch (err) {
          error = err as IFullError;
        }

        const { chatId, receiver } = newMessage;
        const message = await repo.getOneByChatId(chatId, receiver);

        expect(message).toEqual(null);
        expect(error!.message).toEqual(target.message)
      });

      it(`Missing body`, async () => {
        const target = new MongoMissingError('Chat', 'body');
        let error: IFullError | undefined = undefined

        const clone = structuredClone(newMessage);
        clone.body = undefined!;

        try {
          await repo.add(clone);
        } catch (err) {
          error = err as IFullError;
        }

        const { chatId, receiver } = newMessage;
        const message = await repo.getOneByChatId(chatId, receiver);

        expect(message).toEqual(null);
        expect(error!.message).toEqual(target.message)
      });

      it(`Missing sender`, async () => {
        const target = new MongoMissingError('Chat', 'sender');
        let error: IFullError | undefined = undefined

        const clone = structuredClone(newMessage);
        clone.sender = undefined!;

        try {
          await repo.add(clone);
        } catch (err) {
          error = err as IFullError;
        }

        const { chatId, receiver } = newMessage;
        const message = await repo.getOneByChatId(chatId, receiver);

        expect(message).toEqual(null);
        expect(error!.message).toEqual(target.message)
      });

      it(`Missing chatId`, async () => {
        const target = new MongoMissingError('Chat', 'chatId');
        let error: IFullError | undefined = undefined

        const clone = structuredClone(newMessage);
        clone.chatId = undefined!;

        try {
          await repo.add(clone);
        } catch (err) {
          error = err as IFullError;
        }

        const { chatId, receiver } = newMessage;
        const message = await repo.getOneByChatId(chatId, receiver);

        expect(message).toEqual(null);
        expect(error!.message).toEqual(target.message)
      });
    });

    describe('Incorrect data', () => {
      it(`Receiver incorrect`, async () => {
        const clone = structuredClone(newMessage);
        clone.receiver = 'x';

        try {
          await repo.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoNotObjectIdError('Chat', 'receiver', clone.receiver);
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await repo.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });

      it(`Sender incorrect`, async () => {
        const clone = structuredClone(newMessage);
        clone.sender = 'x';

        try {
          await repo.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoNotObjectIdError('Chat', 'sender', clone.sender);
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await repo.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });

      it(`Body incorrect`, async () => {
        const clone = structuredClone(newMessage);
        clone.body = 'x';

        try {
          await repo.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoNotObjectIdError('Chat', 'body', clone.body);
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await repo.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });

      it(`Type incorrect`, async () => {
        const clone = structuredClone(newMessage);
        clone.type = 'x' as EMessageType;

        try {
          await repo.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoIncorrectEnumError('Chat', 'type', clone.type);
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await repo.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });

      it(`ChatId incorrect`, async () => {
        const clone = structuredClone(newMessage);
        clone.chatId = 'x';

        try {
          await repo.add(clone);
        } catch (err) {
          const error = err as IFullError;
          const target = new MongoNotObjectIdError('Chat', 'chatId', clone.chatId);
          expect(error.message).toEqual(target.message);
        }

        const { chatId, receiver } = newMessage;
        const message = await repo.getOneByChatId(chatId, receiver);
        expect(message).toEqual(null);
      });
    });
  });

  describe('Should pass', () => {
    it(`Add message`, async () => {
      await repo.add(newMessage);

      const { chatId, receiver } = newMessage;
      const message = (await repo.getOneByChatId(chatId, receiver)) as IGetOneMessageEntity;

      await sleep(50) // Sleep here only exists, because jest seems to be triggering afterAll too fast

      expect(message).not.toEqual(null);
      expect(message.sender.toString()).toEqual(newMessage.sender);
      expect(message.chatId.toString()).toEqual(newMessage.chatId);
    });
  });
});
