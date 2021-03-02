import { FeathersTransportMqttApplication } from "../@types";
import http from 'http';

export async function setup<T = any>(this: FeathersTransportMqttApplication<T>, server: http.Server, ...rest: any[]) {
  //
}
