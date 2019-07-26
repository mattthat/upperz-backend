import Cors from 'cors';
import BaseServer from 'portico/lib/Server';
import HealthPath from 'portico/lib/paths/HealthPath';
import AboutPath from './paths/AboutPath';
import v1SpotPath from './paths/v1/v1SpotPath';
import SpotService from './services/SpotService';
import SpotCheckSchedulingService from './services/SpotCheckSchedulingService';

export default class Server extends BaseServer {
  constructor(express, i18n, settings) {
    super(express, i18n, settings);
    this.scheduler = new SpotCheckSchedulingService(this.settings);
  }

  registerMiddleware() {
    super.registerMiddleware();
    this.registerCorsMiddleware();
  }

  registerCorsMiddleware() {
    this.express.use(
      Cors({
        origin: '*',
        optionsSuccessStatus: 200
      })
    );
  }

  registerUnVersionPaths() {
    this.registerPath(new HealthPath(this));
    this.registerPath(new AboutPath(this));
  }

  registerV1Paths() {
    super.registerV1Paths();
    this.registerPath(new v1SpotPath(this));
  }

  scheduleSpotChecks() {
    this.scheduler.scheduleSpotChecks();
  }

  rescheduleSpotCheck(id) {
    const spot = new SpotService(this.settings).getSpotById(id);
    this.scheduler.scheduleSpotCheck(spot);
  }
}
