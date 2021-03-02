import Debug from 'debug';

export const debug = Debug('scottpageindysoft/feathers-transport-mqtt');
debug.enabled = process.env.NODE_ENV === 'development';
