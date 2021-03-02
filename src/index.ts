import { socket } from '@feathersjs/transport-commons';
import { ConfigureOptions, FeathersTransportMqttApplication } from './@types';
import { configure } from './configure';
import { Application } from '@feathersjs/feathers';

export function configureTransportMqtt<T = any>(options?: Partial<ConfigureOptions>) {

  return function(this: Application, app: Application) {
    // A function that gets the connection
    const getParams = (socket: any) => socket.feathers;
    // A mapping from connection to socket instance
    const socketMap = new WeakMap();
    app.configure(socket({
      done: configure(app as FeathersTransportMqttApplication<T>, options),
      socketMap,
      getParams,
      emit: 'emit'
    }));
    return app as Application<T>;
  }

}

export default configureTransportMqtt;
