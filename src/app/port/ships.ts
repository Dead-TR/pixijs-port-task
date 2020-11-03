import * as PIXI from 'pixi.js';
import * as TWEEN from "tween.js";
import {Ship, Ships} from '../interfaces';
import Methods from './methods';

export const shipsList: Ships = {
  lastId: 0,
  redShips: [],
  greenShips: [],
}

export const ships = (app: PIXI.Application, ) => {
  const methods = new Methods(app);
  const scene: PIXI.Container = app.stage;
  let startTime = Date.now();
  let randomTime = methods.random(1000, 8000);

  app.ticker.add(() => {
    TWEEN.update();
    const randomShip = methods.random(-10, 10);
    const actualTime = Date.now();
      if (actualTime - startTime > randomTime) {
        const ship: Ship = {
          id: shipsList.lastId++,
        }

        if (randomShip <= 0) {
          ship.type = 'red';
          ship.graphic = methods.createShip(ship.type);
          shipsList.redShips.push(ship);
        } else if (randomShip > 0) {
          ship.type = 'green';
          ship.graphic = methods.createShip(ship.type);
          shipsList.greenShips.push(ship);
        }

        scene.addChild(ship.graphic);
        methods.shipComeToPort(ship, scene);
        startTime = Date.now();
        randomTime = methods.random(1000, 8000);
      }

      methods.endOfWaiting(scene);
  })
}
