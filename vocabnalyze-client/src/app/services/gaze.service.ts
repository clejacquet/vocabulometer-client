import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class GazeService {
  private subscribers: any[] = [];

  private  mean_x = 0;
  private  mean_y = 0;

  private  var1 = 0;
  private  var2 = 0;

  private  angle = 0;

  private  clearBufferTime;

  private  bufferX = [];
  private  bufferY = [];

  private  X_it = 0;
  private  Y_it = 0;

  private CURSOR_MEAN_BUFFER_SIZE = 50;

  // threshold for the sum of var1 and var2 to determine if var1+var2 > VARIANCE_THRESHOLD then we have a saccade
  private VARIANCE_THRESHOLD = 50;
  private FIXATION_MIN_DURATION = 100; // minimum duration of a fixation in milliseconds

  // Detects eyes blinking
  // Returns :
  // 0 : no blinking
  // 1 : both eyes blinking
  // 2 : left eye blinking
  // 3 : right eye blinking
  static eyeBlink(leftX, leftY, rightX, rightY): number {
    if ((leftX === 0. || leftY === 0.) || (rightX === 0. || rightY === 0.)) {

      if (( leftX === 0. || leftY === 0. ) && ( rightX === 0. || rightY === 0. )) {
        return 1;
      }
      if (leftX === 0. || leftY === 0.) {
        return 2;
      }
      return 3;
    }
    return 0;
  }

  start(): void {
    const socket = io('http://localhost:3000');
    socket.on('coordinates', (xl, yl, xr, yr) => {
      this.update(xl, yl, xr, yr);
    });

    const updateRoutine = () => {
      socket.emit('updateRequest');
      setTimeout(updateRoutine, 8);
    };

    updateRoutine();
  };

  subscribe(cb): void {
    this.subscribers.push(cb);
  };

  private addNewCoordinates(leftX, leftY, rightX, rightY): void {
    const old_mean_x = this.mean_x;
    const old_mean_y = this.mean_y;

    const old_var1 = this.var1;
    const old_var2 = this.var2;

    this.updateArrays(leftX, leftY, rightX, rightY);
    this.updateCursor();

    this.subscribers.forEach((cb) => {
      cb({
        type: 'position',
        x: this.mean_x,
        y: this.mean_y,
        var_x: this.var1,
        var_y: this.var2
      });
    });

    if (this.var1 + this.var2 > this.VARIANCE_THRESHOLD) {
      const d = new Date();
      const t = d.getTime();

      if (t - this.clearBufferTime > this.FIXATION_MIN_DURATION) {
        this.subscribers.forEach((cb) => {
          cb({
            type: 'fixation',
            x: old_mean_x,
            y: old_mean_y,
            var_x: old_var1,
            var_y: old_var2
          });
        });
      }

      this.clearBufferTime = t;

      this.bufferX.length = 0;
      this.bufferY.length = 0;

      this.X_it = 0;
      this.Y_it = 0;

      this.updateArrays(leftX, leftY, rightX, rightY);

    }
  }

  private update(leftX, leftY, rightX, rightY): void {
    const blinkValue = GazeService.eyeBlink(leftX, leftY, rightX, rightY);

    // Filtering eyes blinking
    if (blinkValue !== 1) { // no both eyes blinking (in this case, we do nothing)
      if (blinkValue !== 0) {// no blinking

        if (blinkValue === 2) {// left eye
          leftX = rightX;
          leftY = rightY;
        }
        if (blinkValue === 3) {// right eye
          rightX = leftX;
          rightY = leftY;
        }
      }

      const xoffset = window.outerWidth - window.innerWidth;
      const yoffset = window.outerHeight - window.innerHeight;

      leftX = leftX * screen.width - xoffset;
      leftY = leftY * screen.height - yoffset;

      rightX = rightX * screen.width - xoffset;
      rightY = rightY * screen.height - yoffset;

      this.addNewCoordinates(leftX, leftY, rightX, rightY);
    }
  }

  // Averaging the last "CURSOR_MEAN_BUFFER_SIZE" values received
  private updateCursor(): void {
    let sum_x = 0;
    let sum_x2 = 0;

    let sum_y = 0;
    let sum_y2 = 0;

    let count = 0;

    for (let i = 0; i < this.bufferX.length; ++i) {

      sum_x += this.bufferX[i];
      sum_x2 += this.bufferX[i] * this.bufferX[i];
      sum_y += this.bufferY[i];
      sum_y2 += this.bufferY[i] * this.bufferY[i];
      count++;
    }

    const Ex = sum_x / count;
    const Ex2 = sum_x2 / count;
    const Ey = sum_y / count;
    const Ey2 = sum_y2 / count;

    const COVxx = Ex2 - Ex * Ex;
    const COVyy = Ey2 - Ey * Ey;

    this.mean_x = Ex;
    this.mean_y = Ey;

    this.var1 = Math.sqrt(COVxx);
    this.var2 = Math.sqrt(COVyy);

    this.angle = 0.;
  }

  // Keeping only the last "CURSOR_MEAN_BUFFER_SIZE" values
  private updateArrays(leftX, leftY, rightX, rightY): void {
    this.bufferX[this.X_it] = (leftX + rightX) / 2;
    this.X_it = (this.X_it + 1) % this.CURSOR_MEAN_BUFFER_SIZE;

    this.bufferY[this.Y_it] = (leftY + rightY) / 2;
    this.Y_it = (this.Y_it + 1) % this.CURSOR_MEAN_BUFFER_SIZE;
  }
}
