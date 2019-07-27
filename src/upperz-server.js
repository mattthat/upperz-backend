import i18n from 'i18n';
import Express from 'express';
import Server from './lib/Server';

const server = new Server(
  Express(),
  i18n,
  __dirname + '/settings/server-static.js'
);

server.registerMiddleware();

server.registerPaths();

server.scheduleSpotChecks();

server.listen();
