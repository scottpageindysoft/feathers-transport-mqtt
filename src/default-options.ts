import { ConfigureOptions } from "./@types";

export const defaultOptions: ConfigureOptions = {
  mode: 'client',
  brokerHost: 'localhost',
  brokerPort: 1883,
  baseTopic: 'feathers',
  reconnectPeriod: 5000,
  protocol: 'mqtt'
};
