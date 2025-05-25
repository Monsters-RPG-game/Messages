import { afterEach, describe, expect, it } from '@jest/globals';
import Repository from '../../src/modules/details/repository/index.js';
import fakeData from '../utils/fakeData.json';
import FakeFactory from '../utils/fakeFactory/src/index.js';
import { IMessageDetailsEntity } from '../../src/modules/details/entity.js';
import sleep from '../../src/utils/index.js';

describe('Details - get', () => {
  const db = new FakeFactory();
  const fakeDetails = fakeData.details[0] as IMessageDetailsEntity;
  const repo = Repository.createInstance();

  afterEach(async () => {
    await db.cleanUp();
  });

  describe('Should throw', () => {
    describe('Missing data', () => {
      it(`Missing data`, async () => {
        const message = await repo.getIn('_id', [fakeDetails._id as string]);
        expect(message.length).toEqual(0);
      });
    });
  });

  describe('Should pass', () => {
    it(`Get all`, async () => {
      await db.messageDetails.message(fakeDetails.message)._id(fakeDetails._id).create();

      const allDetails = await repo.getAll(1);
      const details = allDetails[0]!;

      expect(allDetails.length).toEqual(1);
      expect(details.message).toEqual(fakeDetails.message);
      expect(details._id.toString()).toEqual(fakeDetails._id);
    });

    it(`Get one`, async () => {
      await db.messageDetails.message(fakeDetails.message)._id(fakeDetails._id).create();

      const allDetails = await repo.getIn('_id', [fakeDetails._id as string]);
      const details = allDetails[0]!;

      await sleep(50) // Sleep here only exists, because jest seems to be triggering afterAll too fast

      expect(allDetails.length).toEqual(1);
      expect(details._id.toString()).toEqual(fakeDetails._id);
      expect(details.message).toEqual(fakeDetails.message);
    });
  });
});
