// From https://github.com/feathersjs/feathers/blob/dove/packages/socketio/src/middleware.ts (dove branch)

import { Application, Params } from '@feathersjs/feathers';
import Debug from 'debug';
import { Socket } from 'socket.io';

const debug = Debug('@feathersjs/socketio/middleware');

export type ParamsGetter = (socket: Socket) => any;
export type NextFunction = (err?: any) => void;
export interface FeathersSocket extends Socket {
  feathers?: Params
}

export const disconnect = (app: Application, getParams: ParamsGetter) =>
  (socket: FeathersSocket, next: NextFunction) => {
    socket.once('disconnect', () => app.emit('disconnect', getParams(socket)));
    next();
  }

export const params = (_app: Application, socketMap: WeakMap<any, any>) =>
  (socket: FeathersSocket, next: NextFunction) => {
    socket.feathers = {
      provider: 'socketio',
      headers: socket.handshake.headers
    };

    socketMap.set(socket.feathers, socket);

    next();
  }

export const authentication = (app: Application, getParams: ParamsGetter, settings: any = {}) => (socket: FeathersSocket, next: NextFunction) => {
  const service = (app as any).defaultAuthentication ? (app as any).defaultAuthentication(settings.service) : null;

  if (service === null) {
    return next();
  }

  const config = service.configuration;
  const authStrategies = config.parseStrategies || config.authStrategies || [];

  if (authStrategies.length === 0) {
    return next();
  }

  service.parse(socket.handshake, null, ...authStrategies)
    .then(async (authentication: any) => {
      if (authentication) {
        debug('Parsed authentication from HTTP header', authentication);
        socket.feathers ? socket.feathers.authentication = authentication : { provider: 'socketio', headers: socket.handshake.headers, authentication: authentication };
        await service.create(authentication, {
          provider: 'socketio',
          connection: getParams(socket)
        });
      }

      next();
    }).catch(next);
}
