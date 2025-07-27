import { beforeEach,afterAll, afterEach, beforeAll } from '@jest/globals';
import FakeBroker from './fakes/broker.js'
import Mongo from '../../src/connections/mongo/factory.js'
import State from '../../src/tools/state.js'
import { cleanDb } from './index.js'

beforeAll(async () => {
  if(State.mongo || State.broker) return

  const broker = new FakeBroker()

  State.broker = broker
  State.mongo = await Mongo.create()
});

beforeEach(async () => {
  await cleanDb()
})

afterAll(async () => {
  State.mongo.disconnect()
});

afterEach(async () => {
    await cleanDb()
})
