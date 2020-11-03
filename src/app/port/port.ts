import * as PIXI from 'pixi.js';
import {Piers} from '../interfaces';
import { ships } from './ships';
import Methods from './methods';

export const piers: Piers = {}

export const port = (app: PIXI.Application) => {
  const methods = new Methods(app);
  const scene: PIXI.Container = app.stage;

  for (let i = 0; i < 4; i++) {
    const y = 20 + (i*120);
    const pier = new PIXI.Graphics();

    methods.piersDraw(pier, true);
    pier.position.set(5, y)
    scene.addChild(pier);

    piers[`pier_${i}`] = {
      graphic: pier,
      full: false,
      free: true,
      y,
    };
  }

  for (let i = 0; i < 2; i++) {
    const gate = new PIXI.Graphics();

    gate.lineStyle(5, 0xffff00);
    gate.beginFill(0xffff00);
    gate.drawRect(250, 0 + (i*350), 10, 150);
    scene.addChild(gate);
  }

  ships(app);
}
