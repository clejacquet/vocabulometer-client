import { Injectable } from '@angular/core';
import { GazeSourceEmitter } from './gaze-source-emitter';
import { GazeSourceTarget } from './gaze-source-target';
import * as io from 'socket.io-client';

@Injectable()
export class GazeRemoteSourceEmitter extends GazeSourceEmitter {
  constructor(private url: string) {
    super();
  }

  start(target: GazeSourceTarget): void {
    const socket = io(this.url);
    socket.on('coordinates', (lx, ly, rx, ry) => {
      target.onMessage(this, {
        lx: lx,
        ly: ly,
        rx: rx,
        ry: ry
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
