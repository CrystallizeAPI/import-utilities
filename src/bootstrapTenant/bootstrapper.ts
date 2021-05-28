import { EventEmitter } from 'events';
import { JsonSpec } from './json-spec';

export class Bootstrapper extends EventEmitter {
  static CRYSTALLIZE_ACCESS_TOKEN_ID: string;
  static CRYSTALLIZE_ACCESS_TOKEN_SECRET: string;

  setAccessToken(id: string, secret: string) {

    if (!id) {
      throw new Error('Missing CRYSTALLIZE_ACCESS_TOKEN_ID');
    }
    if (!secret) {
      throw new Error('Missing CRYSTALLIZE_ACCESS_TOKEN_SECRET');
    }
    Bootstrapper.CRYSTALLIZE_ACCESS_TOKEN_ID = id;
    Bootstrapper.CRYSTALLIZE_ACCESS_TOKEN_SECRET = secret;
  }
  start(json: JsonSpec) {
    console.log('start!');
    console.log(JSON.stringify(json, null, 1));
  }
}