import {GazeSourceTarget} from './gaze-source-target';

export abstract class GazeSourceEmitter {
  private subscribers: Function[] = [];

  abstract start(target: GazeSourceTarget);

  subscribe(cb: Function): void {
    this.subscribers.push(cb);
  }

  notify(msg): void {
    this.subscribers.forEach((subscriber) => {
      subscriber(msg);
    });
  }
}
