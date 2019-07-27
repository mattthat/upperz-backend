import BaseService from 'portico/lib/services/BaseService';
import LoggingPart from 'portico/lib/parts/LoggingPart';
import RuntimeService from 'portico/lib/services/RuntimeService';
import uuidv4 from 'uuid/v4';
import Fetch from 'node-fetch';

export default class SpotService extends BaseService {
  constructor(settings) {
    super(settings);
  }

  static get JSON() {
    return './settings/spots.json';
  }

  spots() {
    try {
      return RuntimeService.readJSFile(SpotService.JSON);
    } catch (x) {
      return {};
    }
  }

  checkSpot(spotId) {
    let spot = this.getSpotById(spotId);
    if (this.settings.runtime.debug)
      LoggingPart.output('Spot checking', {
        id: spot.id,
        url: spot.url
      });
    Fetch(spot.url)
      .then(response => {
        response.text().then(text => {
          spot.status = {
            code: response.status,
            data: text,
            error: null,
            performed: new Date().toISOString()
          };
          this.updateSpot(spot);
        });
      })
      .catch(error => {
        spot.status = {
          code: -1,
          error: error,
          performed: new Date().toISOString()
        };
        this.updateSpot(spot);
      });
  }

  getAllSpots() {
    return this.spots();
  }

  getSpotById(id) {
    const spots = this.spots();
    try {
      if (spots[id] && spots[id].id === id) {
        return spots[id];
      } else {
        return null;
      }
    } catch (x) {
      return null;
    }
  }

  createSpot(item) {
    let spots = this.spots();
    item.id = uuidv4();
    item.status = {
      code: 0,
      error: '',
      performed: new Date().toISOString()
    };
    spots[item.id] = item;
    RuntimeService.writeJSFile(SpotService.JSON, spots);
    return item;
  }

  updateSpot(item) {
    let spots = this.spots();
    if (spots[item.id].url !== item.url) {
      item.status = {
        code: 0,
        error: '',
        performed: new Date().toISOString()
      };
    }
    spots[item.id] = item;
    RuntimeService.writeJSFile(SpotService.JSON, spots);
    return item;
  }

  removeSpot(id) {
    const spots = this.spots();
    delete spots[id];
    RuntimeService.writeJSFile(SpotService.JSON, spots);
  }
}
