import { afterEach, describe, expect, it } from '@jest/globals';
import Repository from '../../src/modules/details/repository/index.js';
import fakeData from '../utils/fakeData.json';
import FakeFactory from '../utils/fakeFactory/src/index.js';
import { IFullError } from '../../src/types/index.js';
import { MongoIncorrectMinLengthError, MongoMissingError } from '../utils/errors/index.js';
import { IMessageDetailsEntity } from '../../src/modules/details/entity.js';
import sleep from '../../src/utils/index.js';

describe('Details - add', () => {
  const db = new FakeFactory();
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const repo = Repository.createInstance();

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('Missing message', () => {
      it(`Missing message`, async () => {
        const target = new MongoMissingError('Details', 'message');
        let error: IFullError | undefined = undefined

        const clone = structuredClone(fakeDetails);
        clone.message = undefined!;

        try {
          await repo.add(clone);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error!.message).toEqual(target.message)
      });
    });

    describe('Incorrect data', () => {
      it(`Receiver incorrect`, async () => {
        const target = new MongoIncorrectMinLengthError('Details', 'message', 2);
        let error: IFullError | undefined = undefined

        const clone = structuredClone(fakeDetails);
        clone.message = 'x';

        try {
          await repo.add(clone);
        } catch (err) {
          error = err as IFullError;
        }

        expect(error!.message).toEqual(target.message)
      });
    });
  });

  describe('Should pass', () => {
    it(`Add message`, async () => {
      await repo.add({ message: fakeDetails.message });

      const messages = await repo.getAll(1);
      const message = messages[0]!;

      await sleep(50) // Sleep here only exists, because jest seems to be triggering afterAll too fast

      expect(messages.length).toEqual(1);
      expect(message.message).toEqual(fakeDetails.message);
    });
  });
});
