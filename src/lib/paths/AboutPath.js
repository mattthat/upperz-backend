import BaseAboutPath from 'portico/lib/paths/AboutPath';

const details = require('../../../package.json');
const buildtime = require('../../buildtime.js');

export default class AboutPath extends BaseAboutPath {
  constructor(server) {
    super(server);
  }

  getAbout(request, response) {
    response.status(200).send({
      name: details.name,
      version: `${details.version}.${buildtime.time}`
    });
  }
}
