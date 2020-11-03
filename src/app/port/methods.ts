import * as PIXI from 'pixi.js';
import * as TWEEN from "tween.js";
import {Pier, Ship, Lines} from '../interfaces';
import {piers} from './port';
import {shipsList} from './ships';

export default class Methods {
  lines: Lines = {
    redLine: [],
    greenLine: [],
  };
  game: PIXI.Application;

  constructor(app: PIXI.Application) {
    this.game = app;
  }

  random(min: number, max: number){
    return Math.round(Math.random()*(max-min) + min);
  }

  createShip (type: string) {
    const ship: PIXI.Graphics = new PIXI.Graphics();
    shipDraw(ship, type);
    ship.position.set(900, 190);

    return ship;
  }

  shipComeToPort(ship: Ship, scene: PIXI.Container) {
    new TWEEN.Tween(ship.graphic)
      .to({x: 300}, 5000)
      .onComplete(()=>{
        if (ship.type === 'red') {
          let busyPiers = 0;
          for (const pier in piers) {
            if (!piers[pier].full) {
              if(piers[pier].free){
                ship.graphic.position.set(
                  100,
                  piers[pier].y + 30
                )
                piers[pier].free = false;
                piers[pier].full = true;

                this.piersDraw(piers[pier].graphic, !piers[pier].full);
                this.shipOutFromPort(ship, scene, piers[pier]);
                break;
              } else {
                busyPiers++;
              }
            } else {
              busyPiers++;
            }
          }

          if (busyPiers === 4) {
            this.lines.redLine.push(ship);
            ship.graphic.x = 200 + (110 * this.lines.redLine.length);
            this.wait(ship);
          }
        } else {
          let busyPiers = 0;
          for (const pier in piers) {
            if (piers[pier].full) {
              if(piers[pier].free){
                ship.graphic.position.set(
                  100,
                  piers[pier].y + 30
                )
                piers[pier].free = false;
                piers[pier].full = false;
                this.piersDraw(piers[pier].graphic, !piers[pier].full);
                this.shipOutFromPort(ship, scene, piers[pier]);
                break;
              } else {
                busyPiers++;
              }
            } else {
              busyPiers++;
            }
          }

          if (busyPiers === 4) {
            this.lines.greenLine.push(ship);
            ship.graphic.x = 200 + (110 * this.lines.greenLine.length);
            this.wait(ship);
          }
        }
      })
      .start();
  }

  wait(ship: Ship) {
    if (ship.type === 'red') {
      ship.graphic.y = 110;
    } else if (ship.type === 'green'){
      ship.graphic.y = 350;
    }
  }

  endOfWaiting(scene: PIXI.Container) {
    for (const pier in piers) {
      if (piers[pier].full) {
        if(piers[pier].free){
          for (let i = this.lines.greenLine.length-1; i >= 0; i--) {
            const ship = this.lines.greenLine[i];
            ship.graphic.position.set(
              100,
              piers[pier].y + 30
            )
            piers[pier].free = false;
            piers[pier].full = false;

            this.lines.greenLine.splice(i, 1);
            this.shipOutFromPort(ship, scene, piers[pier]);
            this.piersDraw(piers[pier].graphic, !piers[pier].full);
            break;
          }
          break;
        }
      } else if (!piers[pier].full) {
        if(piers[pier].free){
          for (let i = this.lines.redLine.length-1; i >= 0; i--) {
            const ship = this.lines.redLine[i];
            ship.graphic.position.set(
              100,
              piers[pier].y + 30
            )
            piers[pier].free = false;
            piers[pier].full = true;

            this.lines.redLine.splice(i, 1);
            this.shipOutFromPort(ship, scene, piers[pier]);
            this.piersDraw(piers[pier].graphic, !piers[pier].full);
            break;
          }
          break;
        }
      }
    }
  }

  shipOutFromPort(ship: Ship, scene: PIXI.Container, pier: Pier) {
    new TWEEN.Tween(ship.graphic)
      .to({x: 1000,}, 4000)
      .delay(5000)
      .start()
      .onStart(() => {
        ship.graphic.clear();
        shipDraw(ship.graphic, ship.type, true);
        ship.graphic.position.set(400, 300)
        pier.free = true;
      })
      .onComplete(()=>{
        if (ship.type === 'red') {
          shipsList.redShips.forEach((unit, i, src) => {
            if (unit.id === ship.id) {
              src.splice(i, 1);
            }
          })
        } else {
          shipsList.greenShips.forEach((unit, i, src) => {
            if (unit.id === ship.id) {
              src.splice(i, 1);
            }
          })
        }

        scene.removeChild(ship.graphic);
      });
  }

  piersDraw(pier: PIXI.Graphics, toEmpty: boolean) {
    if (!toEmpty) {
      pier.clear();
      pier.lineStyle(5, 0xffff00);
      pier.beginFill(0xffff00);
      pier.drawRect(0, 0, 40, 100);
    } else {
      pier.clear();
      pier.lineStyle(5, 0xffff00);
      pier.beginFill(0, 0);
      pier.drawRect(0, 0, 40, 100);
    }
  }
}


function shipDraw(ship: PIXI.Graphics, type: string, redraw = false) {

  let color: number;
  let fill: number[];
  if (!redraw) {
    if (type === 'red') {
      color = 0xff0000;
      fill = [color];
    } else {
      color = 0x00ff00;
      fill = [0, 0];
    }
  } else {
    if (type === 'red') {
      color = 0xff0000;
      fill = [0, 0];
    } else {
      color = 0x00ff00;
      fill = [color];
    }
  }

  ship.lineStyle(5, color);
  ship.beginFill(...fill);
  ship.drawRect(0, 0, 100, 35);
}
