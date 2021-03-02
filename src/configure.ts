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

  return new Promise<asyncMqtt.AsyncClient>((resolve) => {
    const { listen, setup } = app;
    const baseRequestChannel = `${localOptions.baseTopic}/request/#`;
    const baseResponseChannel = `${localOptions.baseTopic}/response/`;
    Object.assign(app, {
      async listen(this: FeathersTransportMqttApplication<T>, ...args: any[]) {
      },
      async setup(this: FeathersTransportMqttApplication<T>, server: http.Server) {
        debug('setup started');
        switch (localOptions.mode) {
          case 'broker':
            break;
          case 'client':
            if (!this.client) {
              this.client = await setupClient(localOptions, baseRequestChannel);
            }
            resolve(this.client);
            return setup.call(this, server); // TODO: Make sure we're passing the correct params, correct number of params, and update the FeathersTransportMqttApplication definition to match
            break;
          default:
            throw new Error(`Invalid mode option "${localOptions.mode}"`);
        }
      }
    });
  });
}
