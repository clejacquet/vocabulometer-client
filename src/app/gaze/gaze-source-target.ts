import { GazeSourceEmitter } from './gaze-source-emitter';

export interface GazeSourceTarget {
  onMessage(emitter: GazeSourceEmitter, msg: any, cb: Function): void;
}
