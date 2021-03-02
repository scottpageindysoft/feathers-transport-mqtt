import { ConfigureOptions } from "../@types";
import asyncMqtt from 'async-mqtt';

export async function setup(options: ConfigureOptions, baseRequestChannel: string) {
  const client = await asyncMqtt.connectAsync(undefined, {
    host: options.brokerHost,
    port: options.brokerPort,
    reconnectPeriod: options.reconnectPeriod,
    protocol: options.protocol
  });
  client.on('connect', async () => {
    await client.subscribe(baseRequestChannel);
  });
  return client;
}
