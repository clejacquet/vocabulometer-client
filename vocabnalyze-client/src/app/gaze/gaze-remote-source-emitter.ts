import { GazeSourceEmitter } from './gaze-source-emitter';
import { GazeSourceTarget } from './gaze-source-target';
import * as io from 'socket.io-client';

export class GazeRemoteSourceEmitter extends GazeSourceEmitter {
  constructor(private url: string) {
    super();
  }

  start(target: GazeSourceTarget): void {
    const socket = io(this.url);
    socket.on('gaze', (lx, ly, rx, ry) => {
      target.onMessage(this, {
        scope: 'screen',
        type: 'gaze',
        lx: lx,
        ly: ly,
        rx: rx,
        ry: ry
      }, (res) => {
        this.notify(res);
      });
    });

    socket.on('fixation', (x, y) => {
      target.onMessage(this, {
        scope: 'screen',
        type: 'fixation',
        lx: x,
        ly: y,
        rx: x,
        ry: y
      }, (res) => {
        this.notify(res);
      });
    });

    const updateRoutine = () => {
      socket.emit('updateRequest');
      setTimeout(updateRoutine, 8);
    };

    updateRoutine();
  };
}
