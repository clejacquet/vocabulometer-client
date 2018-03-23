import { GazeSourceEmitter } from './gaze-source-emitter';
import { GazeSourceTarget } from './gaze-source-target';
import { SignalrService } from '../services/signalr.service';

export class GazeRemoteSourceEmitter extends GazeSourceEmitter {
  constructor(private url: string) {
    super();
  }

  start(target: GazeSourceTarget): void {
    SignalrService.build(this.url, 'chatHub', {
      'onGazePoint': (x, y) => {
        target.onMessage(this, {
          scope: 'screen',
          type: 'gaze',
          lx: x,
          ly: y,
          rx: x,
          ry: y
        }, (res) => {
          this.notify(res);
        });
      },
      'onFixation': (x, y) => {
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
      }
    }, (hub) => {
      const updateRoutine = () => {
        hub.server.updateRequest();
        setTimeout(updateRoutine, 8);
      };

      updateRoutine();
    });
  };
}
