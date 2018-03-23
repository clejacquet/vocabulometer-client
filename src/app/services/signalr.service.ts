import { Injectable } from '@angular/core';

function getWindow (): any {
  return window;
}

export class SignalrWindow extends Window {
  $: any;
}

class SignalConnection {
  chatHub: any;
  hub: any;
}

function start(connection, hub, cb) {
  connection.hub.start().done(function () {
    cb(hub);
  });
}

function waitAndRetry(time_ms, func) {
  setTimeout(function() {
    if (!func()) {
      waitAndRetry(time_ms, func);
    }
  }, time_ms);
}

@Injectable()
export class SignalrService {
  static build(url: string, hubName: string, eventBinds: {}, cb: Function): void {
    const window: SignalrWindow = getWindow();

    const connection: SignalConnection = window.$.connection;
    connection.hub.url = url;

    const hub: any = connection[hubName];

    if (hub) {
      hub.client = eventBinds;

      connection.hub.error(function (err) {
        console.error(err);
        waitAndRetry(5000, function () {
          start(connection, hub, cb);
        });
      });

      start(connection, hub, cb);
    } else {
      console.error('Could not access the hub \'' + hubName + '\'');
    }
  }
}
