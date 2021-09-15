import * as PIXI from 'pixi.js';
import { Project } from '../models/project.model';
import { UtilsService } from './utils.service';

export class DepthMapService {

  utilsService: UtilsService = new UtilsService();

  constructor() {}

  attachImage(project: Project) {
    const container = document.getElementById(this.utilsService.projectIdSel(project));
    const image = project.image;

    const IMG_WIDTH = container.offsetWidth;
    const IMG_HEIGHT = container.offsetHeight;

    const app = new PIXI.Application({
      width: IMG_WIDTH,
      height: IMG_HEIGHT,
    });

    container.appendChild(app.view);

    const img = PIXI.Sprite.from(image.imgUrl);
    img.width = IMG_WIDTH;
    img.height = IMG_HEIGHT;
    app.stage.addChild(img);

    const depthMap = PIXI.Sprite.from(image.depthUrl);
    depthMap.width = IMG_WIDTH;
    depthMap.height = IMG_HEIGHT;
    app.stage.addChild(depthMap);

    const displacementFilter = new PIXI.filters.DisplacementFilter(depthMap);
    app.stage.filters = [displacementFilter];

    container.addEventListener('mousemove', (e) => {
      displacementFilter.scale.x = (IMG_WIDTH / 2 - e.clientX) / 25;
      displacementFilter.scale.y = (IMG_HEIGHT / 2 - e.clientY) / 25;
    });
  }
}
