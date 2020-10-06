import {Entity} from '../../physics/objects.js';
import { circle } from '../../physics/shapes.js';
import {gun, shotgun} from './guns.js';
import drawingUtils from '../drawingUtils.js';

export default class Player extends Entity{
  constructor(projArray,position){
    super();
    this.gun = new shotgun(projArray);
    this.mass = 10;
    this.friction = 0.05;
    this.health = 490;
    this.position = position;
    this.shape = new circle(40,this.position);
    this.hurtSound = new Audio("./assets/Oof.mp3");
  }
  Tick(time,context){
    super.Tick();
    let playergrd = this.generatePlayerGradient(time,context);
    this.shape.style = playergrd;
    this.stayInBounds(context);
  }
  Draw(context){
    super.Draw(context);
    drawingUtils.drawAimIndicator(this,context);
  }
  generatePlayerGradient(time,context){
    let playergrd = context.createRadialGradient(this.position.x, this.position.y, 5, this.position.x, this.position.y,40);
    playergrd.addColorStop(0, "purple");
    playergrd.addColorStop(.4+.3*Math.sin(2*time*Math.PI/2000), "black");
    playergrd.addColorStop(.8+.1*Math.sin(2*time*Math.PI/3000), "red");
    playergrd.addColorStop(.95+.05*Math.sin(2*time*Math.PI/600), "pink");
    return playergrd;
  }
  applyDamage(source){
    this.health-=source.damage; 
    this.hurtSound.play();
    drawingUtils.drawHPBar(this);
    return this;
  }
  setVolume(volume){
    this.hurtSound.volume = volume;
    this.gun.setVolume(volume);
  }
}