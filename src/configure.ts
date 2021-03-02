import asyncMqtt from 'async-mqtt';
import http from 'http';
import { ConfigureOptions, FeathersTransportMqttApplication } from "./@types";
import { setup as setupClient } from './client';
import { debug } from './debug';
import { defaultOptions } from './default-options';

export async function configure<T = any>(app: FeathersTransportMqttApplication<T>, options?: Partial<ConfigureOptions>) {
  const localOptions = defaultOptions;

  if (options) {
    // if (options.mode) localOptions.mode = options.mode; // Not ready to use broker mode
    if (options.brokerHost) localOptions.brokerHost = options.brokerHost;
    if (options.brokerPort) localOptions.brokerPort = options.brokerPort;
    if (options.baseTopic) localOptions.baseTopic = options.baseTopic;
    if (options.reconnectPeriod) localOptions.reconnectPeriod = options.reconnectPeriod;
    if (options.protocol) localOptions.protocol = options.protocol;
  }

  return new Promise<void>((resolve) => {
    const { listen, setup } = app;
    const baseRequestChannel = `${localOptions.baseTopic}/request/#`;
    const baseResponseChannel = `${localOptions.baseTopic}/response/`;
    Object.assign(app, {
      listen(this: FeathersTransportMqttApplication<T>, ...args: any[]) {
        console.info('Listen function called');
        if (typeof listen === 'function') {
          return (listen as any).call(this, ...args);
        }
        const server = http.createServer();
        this.setup(server);
        return server.listen(...args);
      },
      setup(this: FeathersTransportMqttApplication<T>, server: http.Server) {
        console.info('Setup function called');
        debug('setup started');
        switch (localOptions.mode) {
          case 'broker':
            break;
          case 'client':
            if (!this.client) {
              void setupClient(localOptions, baseRequestChannel);
            }
            resolve();
            return setup.call(this, server); // TODO: Make sure we're passing the correct params, correct number of params, and update the FeathersTransportMqttApplication definition to match
          default:
            throw new Error(`Invalid mode option "${localOptions.mode}"`);
        }
      }
    });
  });
}
