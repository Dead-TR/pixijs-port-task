import * as PIXI from 'pixi.js';
import {port} from './port/port';

export class GameApp {
  private app: PIXI.Application;

  constructor(view: HTMLCanvasElement , width: number, height: number) {
    this.app = new PIXI.Application({
      width,
      height,
      backgroundColor : 0x0000ff,
      view,
    });

    port(this.app);
  }
}
