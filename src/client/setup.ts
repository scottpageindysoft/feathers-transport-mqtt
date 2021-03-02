import { ConfigureOptions } from "../@types";
import asyncMqtt from 'async-mqtt';

export async function setup(options: ConfigureOptions, baseRequestChannel: string) {
  console.info('Client setup function called', options, baseRequestChannel);
  try {
    const client = await asyncMqtt.connectAsync(undefined, {
      clientId: 'temp',
      host: options.brokerHost,
      port: options.brokerPort,
      reconnectPeriod: options.reconnectPeriod,
      protocol: options.protocol
    });
    client.on('message', (topic, payload, packet) => {
      console.info(topic, payload, packet);
    });
    const subscriptionGrant = await client.subscribe(baseRequestChannel);
    console.info('Subscribed', subscriptionGrant);
    return client;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
