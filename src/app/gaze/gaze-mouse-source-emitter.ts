import { GazeSourceEmitter } from './gaze-source-emitter';
import { GazeSourceTarget } from './gaze-source-target';

export class GazeMouseSourceEmitter extends GazeSourceEmitter {
  constructor() {
    super();
  }

  start(target: GazeSourceTarget): void {
    window.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;

      target.onMessage(this, {
        scope: 'client',
        type: 'gaze',
        lx: x,
        ly: y,
        rx: x,
        ry: y
      }, (res) => {
        this.notify(res);
      });
    })
  };
}
