import aedes from "aedes";
import asyncMqtt from 'async-mqtt';
import { Application, Params, Service } from '@feathersjs/feathers';

export interface FeathersTransportMqttApplicationExtensions<T> {
  broker?: aedes.Aedes;
  client?: asyncMqtt.AsyncClient;
  defaultAuthentication(service: Service<T>): FeathersTransportMqttApplication<T>;
}

export type FeathersTransportMqttApplication<T> = Application<T> & FeathersTransportMqttApplicationExtensions<T>;

export type Mode = 'broker' | 'client';

export interface ConfigureOptions {
  mode: Mode;
  brokerHost: string;
  brokerPort: number;
  baseTopic: string;
  reconnectPeriod: number;
  protocol?: 'wss' | 'ws' | 'mqtt' | 'mqtts' | 'tcp' | 'ssl' | 'wx' | 'wxs'; // From async-mqtt source
}

export interface FeathersSocket extends aedes.Client {
  feathers?: Params
}
