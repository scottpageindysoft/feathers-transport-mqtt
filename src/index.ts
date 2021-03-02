import TransportCommons from '@feathersjs/transport-commons';
import { ConfigureOptions, FeathersTransportMqttApplication } from './@types';
import { configure } from './configure';

export function configureTransportMqtt<T = any>(options?: Partial<ConfigureOptions>) {

  return function(app: FeathersTransportMqttApplication<T>) {
    // A function that gets the connection
    const getParams = (socket: any) => socket.feathers;
    // A mapping from connection to socket instance
    const socketMap = new WeakMap();
    app.configure(TransportCommons.socket({
      done: configure(app, options),
      socketMap,
      getParams,
      emit: 'emit'
    }));
    return app;
  }

}

export default configureTransportMqtt;
