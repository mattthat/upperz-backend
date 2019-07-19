import BaseService from 'portico/lib/services/BaseService';
import SpotService from './SpotService';
import Cron from 'node-cron';

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
        console.log(`Destroying task for ${spot.id}`);
    }
  }

  scheduleSpotCheck(spot) {
    if (spot.url && spot.schedule && Cron.validate(spot.schedule)) {
      this.destroyScheduledSpotCheck(spot);
      if (this.settings.runtime.debug) console.log(`Scheduling ${spot.id}`);
      this.tasks[spot.id] = Cron.schedule(
        spot.schedule,
        () => {
          new SpotService(this.settings).checkSpot(spot.id);
        },
        { scheduled: true }
      );
    } else {
      if (this.settings.runtime.debug)
        console.log(`${spot.id} could not be scheduled`);
    }
  }
}
