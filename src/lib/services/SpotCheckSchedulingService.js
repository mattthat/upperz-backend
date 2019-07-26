import Cron from 'node-cron';
import BaseService from 'portico/lib/services/BaseService';
import LoggingPart from 'portico/lib/parts/LoggingPart';
import SpotService from './SpotService';

export default class SpotCheckSchedulingService extends BaseService {
  constructor(settings) {
    super(settings);
    this.tasks = {};
  }

  scheduleSpotChecks() {
    const spots = new SpotService(this.settings).getAllSpots();
    const spotIds = Object.keys(spots);
    for (let spotId of spotIds) {
      this.scheduleSpotCheck(spots[spotId]);
    }
  }

  destroyScheduledSpotCheck(spot) {
    if (this.tasks[spot.id]) {
      this.tasks[spot.id].destroy();
      if (this.settings.runtime.debug)
        LoggingPart.output('Destroying task', {
          id: spot.id,
          url: spot.url
        });
    }
  }

  scheduleSpotCheck(spot) {
    if (spot.url && spot.schedule && Cron.validate(spot.schedule)) {
      this.destroyScheduledSpotCheck(spot);
      if (this.settings.runtime.debug)
        LoggingPart.output('Scheduling', {
          id: spot.id,
          url: spot.url
        });
      this.tasks[spot.id] = Cron.schedule(
        spot.schedule,
        () => {
          new SpotService(this.settings).checkSpot(spot.id);
        },
        { scheduled: true }
      );
    } else {
      if (this.settings.runtime.debug)
        LoggingPart.output('Failed to schedule', {
          id: spot.id,
          url: spot.url
        });
    }
  }
}
