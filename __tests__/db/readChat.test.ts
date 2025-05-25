import { afterEach, describe, expect, it } from '@jest/globals';
import Repository from '../../src/modules/chat/repository/index.js';
import fakeData from '../utils/fakeData.json';
import FakeFactory from '../utils/fakeFactory/src/index.js';
import { IMessageDetailsEntity } from '../../src/modules/details/entity.js';
import { IChatMessageEntity } from '../../src/modules/chat/entity.js';
import sleep from '../../src/utils/index.js';

describe('Chat - read', () => {
  const db = new FakeFactory();
  const fakeMessage = fakeData.chatMessages[0] as IChatMessageEntity;
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const repository = Repository.createInstance();

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('Missing data', () => {
      it(`Missing data`, async () => {
        const message = await repository.getByOwner(fakeMessage.sender, 1);
        expect(message.length).toEqual(0);
      });
    });
  });

  describe('Should pass', () => {
    it(`Get all`, async () => {
      await db.chat
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .chatId(fakeMessage.chatId)
        .type(fakeMessage.type)
        ._id(fakeMessage._id)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.messageDetails.message(fakeDetails.message)._id(fakeDetails._id).create();

      await repository.update(fakeMessage.chatId, fakeMessage.sender, { read: true });
      const message = await repository.getOneByChatId(fakeMessage.chatId, fakeMessage.receiver);

      await sleep(50) // Sleep here only exists, because jest seems to be triggering afterAll too fast

      expect(message?.read).toEqual(true);
    });
  });
});
