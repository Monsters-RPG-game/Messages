import Log from 'simpl-loggar';
import type Bootstrap from './bootstrap.js';
import type Broker from '../connections/broker/index.js';
import type Mongo from '../connections/mongo/index.js';
import type { IState } from '../types/index.js';

class State implements IState {
  private _mongo: Mongo | null = null;
  private _broker: Broker | null = null;
  private _controllers: Bootstrap | null = null;

  get mongo(): Mongo {
    return this._mongo!;
  }

  set mongo(value: Mongo) {
    this._mongo = value;
  }

  get broker(): Broker {
    return this._broker!;
  }

  set broker(value: Broker) {
    this._broker = value;
  }

  get controllers(): Bootstrap {
    return this._controllers!;
  }

  set controllers(val: Bootstrap) {
    this._controllers = val;
  }

  @Log.decorateLog('State', 'App closed')
  kill(): void {
    this.mongo.disconnect();
    this.broker.close();
  }
}

export default new State();
