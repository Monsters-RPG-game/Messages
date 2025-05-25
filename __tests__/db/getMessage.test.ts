import { afterEach, describe, expect, it } from '@jest/globals';
import Repository from '../../src/modules/messages/repository/index.js';
import fakeData from '../utils/fakeData.json';
import { IMessageEntity } from '../../src/modules/messages/entity.js';
import FakeFactory from '../utils/fakeFactory/src/index.js';
import { IMessageDetailsEntity } from '../../src/modules/details/entity.js';
import sleep from '../../src/utils/index.js';

describe('Message - get', () => {
  const db = new FakeFactory();
  const fakeMessage = fakeData.messages[0] as IMessageEntity;
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const repo = Repository.createInstance()

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('Missing data', () => {
      it(`Missing data`, async () => {
        const message = await repo.getByOwner(fakeMessage.sender, 1);
        expect(message.length).toEqual(0);
      });
    });
  });

  describe('Should pass', () => {
    it(`Get all`, async () => {
      await db.messages
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .chatId(fakeMessage.chatId)
        .type(fakeMessage.type)
        ._id(fakeMessage._id)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.messageDetails.message(fakeDetails.message)._id(fakeDetails._id).create();

      const messages = await repo.getByOwner(fakeMessage.sender, 1);
      const message = messages[0]!;

      expect(messages.length).toEqual(1);
      expect(message.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(message.sender.toString()).toEqual(fakeMessage.sender);
      expect(message.receiver.toString()).toEqual(fakeMessage.receiver);
      expect(message.type).toEqual(fakeMessage.type);
    });

    it(`Get one`, async () => {
      await db.messages
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .chatId(fakeMessage.chatId)
        .type(fakeMessage.type)
        ._id(fakeMessage._id)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.messageDetails.message(fakeDetails.message)._id(fakeDetails._id).create();

      const message = await repo.getOne(fakeMessage.sender, fakeMessage.receiver);

      expect(message?.chatId.toString()).toEqual(fakeMessage.chatId);
    });

    it(`Get unread`, async () => {
      await db.messages
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .chatId(fakeMessage.chatId)
        .type(fakeMessage.type)
        ._id(fakeMessage._id)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.messageDetails.message(fakeDetails.message)._id(fakeDetails._id).create();

      const messages = await repo.getUnread(fakeMessage.receiver, 1);
      const message = messages[0]!;

      expect(messages.length).toEqual(1);
      expect(message.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(message.sender.toString()).toEqual(fakeMessage.sender);
      expect(message.receiver.toString()).toEqual(fakeMessage.receiver);
    });

    it(`Get one by chatId`, async () => {
      await db.messages
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .chatId(fakeMessage.chatId)
        .type(fakeMessage.type)
        ._id(fakeMessage._id)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.messageDetails.message(fakeDetails.message)._id(fakeDetails._id).create();

      const message = await repo.getOneByChatId(fakeMessage.chatId, fakeMessage.receiver);
      expect(message?.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(message?.sender.toString()).toEqual(fakeMessage.sender);
      expect(message?.read).toEqual(fakeMessage.read);
    });

    it(`Get with details`, async () => {
      await db.messages
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .chatId(fakeMessage.chatId)
        .type(fakeMessage.type)
        ._id(fakeMessage._id)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.messageDetails.message(fakeDetails.message)._id(fakeDetails._id).create();

      const messages = await repo.getWithDetails(fakeMessage.chatId, 1);
      const message = messages[0]!;

      await sleep(50) // Sleep here only exists, because jest seems to be triggering afterAll too fast

      expect(messages.length).toEqual(1);
      expect(message.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(message.sender.toString()).toEqual(fakeMessage.sender);
      expect(message.receiver.toString()).toEqual(fakeMessage.receiver);
      expect(message.read).toEqual(fakeMessage.read);
      expect(message.message).toEqual(fakeDetails.message);
    });
  });
});
