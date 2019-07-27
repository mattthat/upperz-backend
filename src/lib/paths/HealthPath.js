import BaseHealthPath from 'portico/lib/paths/HealthPath';
import PublicRouter from 'portico/lib/routers/PublicRouter';

export default class HealthPath extends BaseHealthPath {
  get base() {
    return `/health`;
  }

  constructor(server) {
    super(server);
    this.controller = new PublicRouter();
    this.controller.get('/', this.getHealthCheck.bind(this));
  }
}
