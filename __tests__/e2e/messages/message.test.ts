import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import GetController from '../../../src/modules/messages/subModules/get/index.js';
import SendController from '../../../src/modules/messages/subModules/send/index.js';
import ReadController from '../../../src/modules/messages/subModules/read/index.js'
import * as errors from '../../../src/errors/index.js'
import fakeData from '../../utils/fakeData.json';
import { IFullMessageEntity, IMessageEntity, IPreparedMessagesBody } from '../../../src/modules/messages/entity.js';
import { IMessageDetailsEntity } from '../../../src/modules/details/entity.js';
import FakeFactory from '../../utils/fakeFactory/src/index.js';
import { ISendMessageDto } from '../../../src/modules/messages/subModules/send/types.js';
import { IGetMessageDto } from '../../../src/modules/messages/subModules/get/types.js';
import { IUserBrokerInfo } from '../../../src/types/user.js';
import MessagesRepository from '../../../src/modules/messages/repository/index.js';
import DetailsRepository from '../../../src/modules/details/repository/index.js';
import GetMessageDto from '../../../src/modules/messages/subModules/get/dto.js';
import SendMessageDto from '../../../src/modules/messages/subModules/send/dto.js';
import { IReadMessageDto } from '../../../src/modules/messages/subModules/read/types.js';
import mongoose from 'mongoose';
import GetUnreadMessageDto from '../../../src/modules/messages/subModules/getUnread/dto.js';
import GetUnreadMessageController from '../../../src/modules/messages/subModules/getUnread/index.js';
import ReadMessageDto from '../../../src/modules/messages/subModules/read/dto.js';
import { IFullError } from '../../../src/types/errors.js';

describe('Messages', () => {
  const db = new FakeFactory();
  const fakeMessage = fakeData.messages[0] as IMessageEntity;
  const fakeMessage2 = fakeData.messages[1] as IMessageEntity;
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const fakeDetails2 = fakeData.details[1] as IMessageDetailsEntity;
  const localUser: IUserBrokerInfo = {
    userId: fakeMessage.sender,
    tempId: 'tempId',
  };
  const messageReceiver: IUserBrokerInfo = {
    userId: fakeMessage.receiver,
    tempId: 'tempId',
  };
  const get: IGetMessageDto = { page: 1, target: fakeMessage.chatId };
  const getMany: IGetMessageDto = { page: 1 };
  const read: IReadMessageDto = { chatId: fakeMessage.chatId, user: fakeMessage.receiver };
  const send: ISendMessageDto = {
    body: fakeDetails.message,
    receiver: fakeMessage.sender,
    sender: fakeMessage.receiver,
  };
  const messageRepo =  MessagesRepository.createInstance()
  const detailsRepo =  DetailsRepository.createInstance()
  const getController = new GetController(messageRepo);
  const sendController = new SendController(messageRepo, detailsRepo);
  const readController = new ReadController(messageRepo);
  const getUnreadController = new GetUnreadMessageController(messageRepo)

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('No data passed', () => {
      it(`Get one - missing page`, async () => {
        let target = new errors.MissingArgError('page')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(get);
        clone.page = undefined!

        try {
          const data = new GetMessageDto(clone)
          await getController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Read - missing user`, async () => {
        let target = new errors.MissingArgError('user')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(read);
        clone.user = undefined!

        try {
          const data = new ReadMessageDto(clone)
          await readController.execute(data)
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Read - missing id`, async () => {
        let target = new errors.MissingArgError('chatId')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(read);
        clone.chatId = undefined!

        try {
          const data = new ReadMessageDto(clone)
          await readController.execute(data)
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Send - missing body`, async () => {
        let target = new errors.MissingArgError('body')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(send);
        clone.body = undefined!

        try {
          const data = new SendMessageDto(clone)
          await sendController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Send - missing receiver`, async () => {
        let target = new errors.MissingArgError('receiver')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(send);
        clone.receiver = undefined!

        try {
          const data = new SendMessageDto(clone)
          await sendController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Send - missing sender`, async () => {
        let target = new errors.MissingArgError('sender')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(send);
        clone.sender = undefined!

        try {
          const data = new SendMessageDto(clone)
          await sendController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Get many - missing page`, async () => {
        let target = new errors.MissingArgError('page')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(get);
        clone.page = undefined!

        try {
          const data = new GetMessageDto(clone)
          await getController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Get unread - missing page`, async () => {
        let target = new errors.MissingArgError('page')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(get);
        clone.page = undefined!

        try {
          const data = new GetUnreadMessageDto(clone)
          await getUnreadController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });
    });

    describe('Incorrect data', () => {
      beforeEach(async () => {
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
      });

      afterEach(async () => {
        await db.cleanUp();
      });

      it(`Get one - page incorrect type`, async () => {
        let target = new errors.IncorrectArgTypeError('page should be number')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(get);
        clone.page = 'a' as unknown as number

        try {
          const data = new GetMessageDto(clone)
          await getController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Read - user incorrect type`, async () => {
        let target = new errors.IncorrectArgTypeError('user should be objectId')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(read);
        clone.user = 'asd';

        try {
          const data = new ReadMessageDto(clone)
          await readController.execute(data)
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Read - id incorrect type`, async () => {
        let target = new errors.IncorrectArgTypeError('chatId should be objectId')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(read);
        clone.chatId = 'asd';

        try {
          const data = new ReadMessageDto(clone)
          await readController.execute(data)
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Send - body too short`, async () => {
        let target = new errors.IncorrectArgLengthError('body', 2, 1000)
        let error: IFullError | undefined = undefined

        const clone = structuredClone(send);
        clone.body = 'a';

        try {
          const data = new SendMessageDto(clone)
          await sendController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Send - receiver incorrect type`, async () => {
        let target = new errors.IncorrectArgTypeError('receiver should be objectId')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(send);
        clone.receiver = 'abc';

        try {
          const data = new SendMessageDto(clone)
          await sendController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Send - sender incorrect type`, async () => {
        let target = new errors.IncorrectArgTypeError('sender should be objectId')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(send);
        clone.sender = 'abc';

        try {
          const data = new SendMessageDto(clone)
          await sendController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Get many - page incorrect type`, async () => {
        let target = new errors.IncorrectArgTypeError('page should be number')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(getMany);
        clone.page = 'a' as unknown as number;

        try {
          const data = new GetMessageDto(clone)
          await getController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Get unread - page incorrect type`, async () => {
        let target = new errors.IncorrectArgTypeError('page should be number')
        let error: IFullError | undefined = undefined

        const clone = structuredClone(getMany);
        clone.page = 'abc' as unknown as number;

        try {
          const data = new GetUnreadMessageDto(clone)
          await getUnreadController.execute(data, new mongoose.Types.ObjectId().toString())
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });

      it(`Send - cannot send message to yourself`, async () => {
        let target = new errors.ActionNotAllowed()
        let error: IFullError | undefined = undefined

        const clone = structuredClone(send);
        clone.sender = localUser.userId as string

        try {
          const data = new SendMessageDto(clone)
          await sendController.execute(data, localUser.userId as string)
        } catch (err) {
          error = err as IFullError
        }

        expect(error!.message).toEqual(target.message)
        expect(error!.code).toEqual(target.code)
        expect(error!.status).toEqual(target.status)
      });
    });
  });

  describe('Should pass', () => {
    beforeEach(async () => {
      await db.messages
        .sender(fakeMessage.sender)
        .body(fakeMessage.body)
        .chatId(fakeMessage.chatId)
        .type(fakeMessage.type)
        ._id(fakeMessage._id)
        .read(fakeMessage.read)
        .receiver(fakeMessage.receiver)
        .create();
      await db.messages
        ._id(fakeMessage2._id)
        .chatId(fakeMessage2.chatId)
        .type(fakeMessage2.type)
        .sender(fakeMessage2.sender)
        .body(fakeMessage2.body)
        .read(fakeMessage2.read)
        .receiver(fakeMessage2.receiver)
        .create();
      await db.messageDetails._id(fakeDetails._id).message(fakeDetails.message).create();
      await db.messageDetails._id(fakeDetails2._id).message(fakeDetails2.message).create();
    });

    afterEach(async () => {
      await db.cleanUp();
    });

    it(`Get one`, async () => {
      const data = (await getController.execute(new GetMessageDto(get), localUser.userId as string)) as IFullMessageEntity[];
      const elm = data[0]!;

      expect(data.length).toEqual(2);
      expect(elm.read).toEqual(fakeMessage.read);
      expect(elm.receiver.toString()).toEqual(fakeMessage.receiver);
      expect(elm.sender.toString()).toEqual(fakeMessage.sender);
      expect(elm.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(elm.message).toEqual(fakeDetails.message);
    });

    it(`Get many`, async () => {
      const data = (await getController.execute(new GetMessageDto(getMany), localUser.userId as string)) as Record<string, IPreparedMessagesBody>;
      const target = Object.keys(data)[0]!;
      const elm = data[target]!;

      expect(Object.keys(data).length).toEqual(1);
      expect(elm.sender.toString()).toEqual(fakeMessage.receiver);
      expect(elm.receiver.toString()).toEqual(fakeMessage.sender);
      expect(elm.messages).toEqual(2);
    });

    it(`Get unread`, async () => {
      const data = await getUnreadController.execute(new GetUnreadMessageDto(getMany), messageReceiver.userId as string);
      const elm = data[0]!;

      expect(data.length).toEqual(1);
      expect(elm.participants.includes(fakeMessage.sender)).toEqual(true);
      expect(elm.chatId.toString()).toEqual(fakeMessage.chatId);
      expect(elm.unread).toEqual(1);
    });

    it(`Read`, async () => {
      const before = await getUnreadController.execute(new GetUnreadMessageDto(getMany), messageReceiver.userId as string);
      expect(before.length).toEqual(1);

      await readController.execute(new ReadMessageDto(read));

      const after = await getUnreadController.execute(new GetUnreadMessageDto(getMany), messageReceiver.userId as string);
      expect(after.length).toEqual(0);
    });

    it(`Send`, async () => {
      await sendController.execute(new SendMessageDto(send), fakeMessage.receiver as string);

      const data = await getController.execute(new GetMessageDto(getMany), localUser.userId as string) as Record<string, IPreparedMessagesBody>
      const key = Object.keys(data)[0]!;

      expect(data[key]?.messages).toEqual(3);
    });
  });
});
