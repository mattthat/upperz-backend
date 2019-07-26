import BasePath from 'portico/lib/paths/BasePath';
import PublicRouter from 'portico/lib/routers/PublicRouter';
import SpotService from '../../services/SpotService';
import ResponseMapper from 'portico/lib/mappers/ResponseMapper';
import SpotCheckSchedulingService from '../../services/SpotCheckSchedulingService';

export default class v1SpotPath extends BasePath {
  get base() {
    return `${super.base}/v1/spot`;
  }

  constructor(server) {
    super(server);
    this.controller = new PublicRouter();
    this.controller.get('/', this.getAllSpots.bind(this));
    this.controller.get('/:id', this.getSpotById.bind(this));
    this.controller.put('/:id', this.putSpot.bind(this));
    this.controller.post('/', this.postSpot.bind(this));
    this.controller.delete('/:id', this.deleteSpot.bind(this));
    this.scheduler = new SpotCheckSchedulingService(this.server.settings);
  }

  getAllSpots(request, response) {
    ResponseMapper.success(
      response,
      new SpotService(this.server.settings).getAllSpots()
    );
  }

  getSpotById(request, response) {
    if (request.params.id) {
      ResponseMapper.success(
        response,
        new SpotService(this.server.settings).getSpotById(request.params.id)
      );
    } else {
      ResponseMapper.invalidParameters(response);
    }
  }

  putSpot(request, response) {
    if (
      request.params.id &&
      request.body &&
      request.body.id &&
      request.params.id === request.body.id &&
      request.body.url &&
      request.body.schedule
    ) {
      ResponseMapper.success(
        response,
        new SpotService(this.server.settings).updateSpot(request.body)
      );
      this.server.rescheduleSpotCheck(request.params.id);
    } else {
      ResponseMapper.invalidParameters(response);
    }
  }

  postSpot(request, response) {
    if (request.body && request.body.url && request.body.schedule) {
      const spot = new SpotService(this.server.settings).createSpot(
        request.body
      );
      ResponseMapper.success(response, spot);
      this.server.rescheduleSpotCheck(spot.id);
    } else {
      ResponseMapper.invalidParameters(response);
    }
  }

  deleteSpot(request, response) {
    if (request.params.id) {
      ResponseMapper.success(
        response,
        new SpotService(this.server.settings).removeSpot(request.params.id)
      );
      this.server.rescheduleSpotCheck(request.params.id);
    } else {
      ResponseMapper.invalidParameters(response);
    }
  }
}
