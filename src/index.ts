import { socket } from '@feathersjs/transport-commons';
import { ConfigureOptions, FeathersTransportMqttApplication } from './@types';
import { configure } from './configure';
import { Application } from '@feathersjs/feathers';
import { debug } from './debug';

export function configureTransportMqtt<T = any>(options?: Partial<ConfigureOptions>) {
  console.info('Configuring MQTT transport');
  console.debug('With options: ', options);

  return function(app: Application) {
    console.info('Inside MQTT transport return function');
    // A function that gets the connection
    const getParams = (socket: any) => socket.feathers;
    // A mapping from connection to socket instance
    const socketMap = new WeakMap();
    const done = configure(app as FeathersTransportMqttApplication<T>, options);
    app.configure(socket({
      done,
      socketMap,
      getParams,
      emit: 'emit'
    }));
  }

}

export default configureTransportMqtt;
