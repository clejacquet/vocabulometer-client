import { GazeSourceEmitter } from './gaze-source-emitter';
import { GazeSourceTarget } from './gaze-source-target';

export class GazeMouseSourceEmitter extends GazeSourceEmitter {
  constructor() {
    super();
  }

  start(target: GazeSourceTarget): void {
    window.addEventListener('mousemove', (e) => {
      const x = (e.screenX - 1920) / window.screen.width;
      const y = e.screenY / window.screen.height;

      target.onMessage(this, {
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
